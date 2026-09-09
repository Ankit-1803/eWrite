const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const ShortUniqueId = require("short-unique-id");
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const User = require("../models/userSchema");
const { generateJWT, verifyJWT } = require("../utils/generateToken");
const transporter = require("../utils/transporter");
const { uploadImage, deleteImageFromCloudinary } = require("../utils/uploadImage");

const { randomUUID } = new ShortUniqueId({ length: 5 });

// Initialize Firebase Admin SDK safely
function initFirebaseAdmin() {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    let serviceAccountCredential = null;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            let raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
            if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
                raw = raw.slice(1, -1).trim();
            }
            const jsonString = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf-8");
            serviceAccountCredential = JSON.parse(jsonString);
        } catch (err) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:", err.message);
        }
    } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        serviceAccountCredential = {
            projectId: process.env.FIREBASE_PROJECT_ID || "ewrite-fe5d3",
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        };
    } else {
        const customPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const localKeyPath = path.resolve(__dirname, "../ewrite-fe5d3-firebase-adminsdk-fbsvc-2dc66c3111.json");
        const renderSecretPath = "/etc/secrets/firebase-service-account.json";

        const pathToLoad = [customPath, localKeyPath, renderSecretPath].find((p) => p && fs.existsSync(p));
        if (pathToLoad) {
            try {
                serviceAccountCredential = require(pathToLoad);
            } catch (err) {
                console.error("Failed to load Firebase service account keyfile:", err.message);
            }
        }
    }

    // Always specify projectId so getAuth().verifyIdToken() never fails with "Unable to detect a Project Id"
    const projectId =
        process.env.FIREBASE_PROJECT_ID ||
        serviceAccountCredential?.project_id ||
        serviceAccountCredential?.projectId ||
        "ewrite-fe5d3";

    const appOptions = { projectId };
    if (serviceAccountCredential) {
        appOptions.credential = cert(serviceAccountCredential);
    }

    try {
        const app = initializeApp(appOptions);
        console.log(`Firebase Admin initialized successfully (projectId: ${projectId})`);
        return app;
    } catch (err) {
        console.error("Firebase Admin initialization error:", err.message);
    }
}

initFirebaseAdmin();

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const emailSender = process.env.EMAIL_FROM || process.env.EMAIL_USER;


// Create a new user
async function createUser(req, res) {
    const { name, email, password } = req.body;
    try {
        // Validations for entries
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Please fill name fields",
            });
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please fill email fields",
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Please fill password fields",
            });
        }

        // Check if user already exists
        const checkForExistingUser = await User.findOne({ email }).select("+googleAuth +password +isVerify");

        if (checkForExistingUser) {
            if (checkForExistingUser.googleAuth && !checkForExistingUser.password) {
                return res.status(400).json({
                    success: false,
                    message: "This email is already registered with Google. Please continue with Google sign in.",  
                });
            }

            if (checkForExistingUser.isVerify) {
                return res.status(400).json({
                    success: false,
                    message: "An account with this email already exists. Please sign in.",
                });
            } else {
                // User exists but is unverified -> Resend verification email
                let verificationToken = await generateJWT({ email: checkForExistingUser.email, id: checkForExistingUser._id });
                try {
                    await transporter.sendMail({
                        from: emailSender,
                        to: checkForExistingUser.email,
                        subject: "Email verification for eWrite",
                        text: "Please verify your email",
                        html: `<h1> Click on the link to verify your email </h1>
                        <a href="${clientUrl}/verify-email/${verificationToken}">Verify Email</a>
                        `,
                    });
                    return res.status(200).json({
                        success: true,
                        message: "A verification email has been resent to your account. Please check your inbox.",
                    });
                } catch (emailErr) {
                    console.error("Failed to resend verification email:", emailErr.message);
                    return res.status(500).json({
                        success: false,
                        message: "Failed to send verification email. " + (emailErr.message.includes("ETIMEDOUT") ? "Outbound SMTP port 465 timed out on Render free tier. Please configure RESEND_API_KEY." : emailErr.message),
                        error: emailErr.message,
                    });
                }
            }
        }

        // Apply hashing on password
        const hashedPass = await bcrypt.hash(password, 10);

        // Generate username
        const username = email.split("@")[0] + randomUUID();

        // Support AUTO_VERIFY_EMAIL for environments without outbound email access (e.g. Render free tier)
        const autoVerify = process.env.AUTO_VERIFY_EMAIL === "true";

        // Insert user data in DB
        const newUser = await User.create({
            name,
            email,
            password: hashedPass,
            username,
            isVerify: autoVerify,
        });

        if (autoVerify) {
            let token = await generateJWT({ email: newUser.email, id: newUser._id });
            return res.status(200).json({
                success: true,
                message: "Account created successfully",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    username: newUser.username,
                    profilePic: newUser.profilePic,
                    bio: newUser.bio,
                    showLikedBlogs: newUser.showLikedBlogs,
                    showSavedBlogs: newUser.showSavedBlogs,
                    token,
                },
            });
        }

        // Generate verification token and send email
        let verificationToken = await generateJWT({ email: newUser.email, id: newUser._id });

        try {
            await transporter.sendMail({
                from: emailSender,
                to: email,
                subject: "Email verification for eWrite",
                text: "Please verify your email",
                html: `<h1> Click on the link to verify your email </h1>
                <a href="${clientUrl}/verify-email/${verificationToken}">Verify Email</a>
                `,
            });
        } catch (emailErr) {
            // Delete newly created unverified user so they are not locked out from signing up again
            await User.findByIdAndDelete(newUser._id);
            console.error("Failed to send verification email:", emailErr.message);
            return res.status(500).json({
                success: false,
                message: "Failed to send verification email. " + (emailErr.message.includes("ETIMEDOUT") ? "Outbound SMTP port 465 timed out on Render free tier. Use RESEND_API_KEY or set AUTO_VERIFY_EMAIL=true." : emailErr.message),
                error: emailErr.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Please check your email to verify your account",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "User data have some error",
            error: err.message,
        });
    }
}

// Email verification
async function verifyEmail(req, res) {
    try {
        const {verificationToken} = req.params
        const verifyToken = await verifyJWT(verificationToken)

        if(!verifyToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token / Email Expired"
            })
        }

        const {id} = verifyToken
        const user = await User.findByIdAndUpdate(id, {isVerify: true}, {new: true})

        if(!user){
            return res.status(400).json({
                success:false,
                message:"This user is not exist",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })
    } catch(err){
        return res.status(500).json({
            success:false,
            message:"User data have some error",
            error:err.message,
        })
    }
}

// Login user
async function login(req, res) {
    const { email, password } = req.body;
    try {
        // Validations for entries
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please fill email fields",
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Please fill password fields",
            });
        }

        // Check if user exists
        const checkForExistingUser = await User.findOne({ email }).select(
            "+password +isVerify +googleAuth name email profilePic username bio showLikedBlogs showSavedBlogs"
        );

        if (!checkForExistingUser) {
            return res.status(400).json({
                success: false,
                message: "This user does not exist",
            });
        }
        
        if (checkForExistingUser.googleAuth && !checkForExistingUser.password) {
            return res.status(400).json({
                success: false,
                message: "This email is registered with Google. Please continue with Google sign in.",  
            });
        }
        
        // Verify password
        const checkForPassword = await bcrypt.compare(password, checkForExistingUser.password);
        
        if (!checkForPassword) {
            return res.status(400).json({
                success: false,
                message: "Password is wrong",
            });
        }
        
        if (!checkForExistingUser.isVerify) {
            // Send verification email
            let verificationToken = await generateJWT({ email: checkForExistingUser.email, id: checkForExistingUser._id });
            try {
                await transporter.sendMail({
                    from: emailSender,
                    to: checkForExistingUser.email,
                    subject: "Email verification for eWrite",
                    text: "Please verify your email",
                    html: `<h1> Click on the link to verify your email </h1>
                    <a href="${clientUrl}/verify-email/${verificationToken}">Verify Email</a>
                    `,
                });
            } catch (emailErr) {
                console.error("Failed to send verification email:", emailErr.message);
                return res.status(500).json({
                    success: false,
                    message: "Failed to send verification email. " + (emailErr.message.includes("ETIMEDOUT") ? "Outbound SMTP port 465 timed out on Render free tier. Use RESEND_API_KEY or set AUTO_VERIFY_EMAIL=true." : emailErr.message),
                    error: emailErr.message,
                });
            }
            
            return res.status(400).json({
                success: false,
                message: "Please verify your email",
            });
        }

        // Generate authentication token
        let token = await generateJWT({ email: checkForExistingUser.email, id: checkForExistingUser._id });

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            user: {
                id: checkForExistingUser._id,
                name: checkForExistingUser.name,
                email: checkForExistingUser.email,
                profilePic: checkForExistingUser.profilePic,
                username: checkForExistingUser.username,
                bio: checkForExistingUser.bio,
                token,
                showLikedBlogs: checkForExistingUser.showLikedBlogs,
                showSavedBlogs: checkForExistingUser.showSavedBlogs,
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "User data have some error",
            error: err.message,
        });
    }
}

// Fetch all users
async function getUser(req, res) {
    try {
        const users = await User.find({});
        return res.status(200).json({
            success: true,
            message: "User is Fetch successfully",
            users,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Fetching a user have some error",
            error: err.message,
        });
    }
}

// Fetch a user by username
async function getUserById(req, res) {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username })
            .populate({
                path: "blogs",
                populate: { path: "creator", select: "name username profilePic" },
            })
            .populate({
                path: "likeBlogs",
                populate: { path: "creator", select: "name username profilePic" },
            })
            .populate({
                path: "saveBlogs",
                populate: { path: "creator", select: "name username profilePic" },
            })
            .populate({
                path: "followers following",
                select: "name username",
            })
            .select("-password -isVerify -__v -email -googleAuth");
        
        // If user not found
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "This user is not exist",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User is Fetch successfully",
            user,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Fetching a user have some error",
            error: err.message,
        });
    }
}

// Update a user
async function updateUser(req, res){
    try {
        const id=req.params.id
        const {name, username, bio}=req.body

        const image = req.file

        // Validations
        const user = await User.findById(id)
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if(req.user.toString() !== id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized for this action"
            })
        }

        // Handle profile image update
        if (image) {
            if (user.profilePicId) {
                await deleteImageFromCloudinary(user.profilePicId);
            }
            const { secure_url, public_id } = await uploadImage(
                `data:image/jpeg;base64,${image.buffer.toString("base64")}`
            );
            user.profilePic = secure_url;
            user.profilePicId = public_id;
        } else if (req.body.profilePic === "null" || req.body.profilePic === "" || req.body.removeProfilePic === "true") {
            if (user.profilePicId) {
                await deleteImageFromCloudinary(user.profilePicId);
            }
            user.profilePic = null;
            user.profilePicId = null;
        }

        // Handle username change
        if (username && user.username !== username) {
            // Check if desired username is already taken
            const findUser = await User.findOne({ username });
            if (findUser && findUser._id.toString() !== id.toString()) {
                return res.status(400).json({
                    success: false,
                    message: "Username is already exist",
                });
            }
            user.username = username;
        }

        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User's data is updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                username: user.username,
                bio: user.bio,
                showLikedBlogs: user.showLikedBlogs,
                showSavedBlogs: user.showSavedBlogs,
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Please try again",
            error: err.message,
        });
    }
}

// Delete a user
async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(200).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            deletedUser,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Please try again",
            error: err.message,
        });
    }
}

// Google OAuth authentication
async function googleAuth(req, res) {
    try {
        const { accessToken } = req.body;
        const response = await getAuth().verifyIdToken(accessToken);
        const { name, email } = response;

        // Check if user already exists
        let user = await User.findOne({ email }).select("+googleAuth +password +isVerify");

        // If user already exists:
        if (user) {
            // Allow login if user was registered with Google or has no password (OAuth account)
            if (user.googleAuth || !user.password) {
                if (!user.googleAuth || !user.isVerify) {
                    user.googleAuth = true;
                    user.isVerify = true;
                    await user.save();
                }

                let token = await generateJWT({ email: user.email, id: user._id });

                return res.status(200).json({
                    success: true,
                    message: "Logged in successfully",
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        profilePic: user.profilePic,
                        bio: user.bio,
                        showLikedBlogs: user.showLikedBlogs,
                        showSavedBlogs: user.showSavedBlogs,
                        token,
                    },
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "This email is registered with a password. Please sign in with your email and password.",
                });
            }
        }

        const username = email.split("@")[0] + randomUUID();
        let newUser = await User.create({
            name: name || email.split("@")[0],
            email,
            username,
            googleAuth: true,
            isVerify: true,
        });

        let token = await generateJWT({ email: newUser.email, id: newUser._id });

        return res.status(200).json({
            success: true,
            message: "Registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                profilePic: newUser.profilePic,
                bio: newUser.bio,
                showLikedBlogs: newUser.showLikedBlogs,
                showSavedBlogs: newUser.showSavedBlogs,
                token,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Please try again",
            error: error.message,
        });
    }
}

// Follow or unfollow a user
async function followUser(req, res) {
    try {
        const followerId = req.user;
        const { id } = req.params;
        
        // Users cannot follow themselves
        if (followerId.toString() === id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You can't follow yourself",
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "This user does not exist",
            });
        }

        const isFollowing = user.followers.some((f) => f.toString() === followerId.toString());

        if (!isFollowing) {
            // Add follower to target user and target to current user's following
            await User.findByIdAndUpdate(id, { $addToSet: { followers: followerId } });
            await User.findByIdAndUpdate(followerId, { $addToSet: { following: id } });

            return res.status(200).json({
                success: true,
                message: "Follow",
                isFollowing: true,
            });
        } else {
            // Remove follower from target user and target from current user's following
            await User.findByIdAndUpdate(id, { $pull: { followers: followerId } });
            await User.findByIdAndUpdate(followerId, { $pull: { following: id } });

            return res.status(200).json({
                success: true,
                message: "Unfollow",
                isFollowing: false,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Update saved and liked blog visibility settings
async function changeSavedLikedBlog(req, res) {
    try {
        const userId = req.user;
        
        const user = await User.findById(userId);
        const { showLikedBlogs, showSavedBlogs } = req.body;

        if (!user) {
            return res.status(500).json({
                message: "This user is not exist",
            });
        }

        await User.findByIdAndUpdate(userId, { showSavedBlogs, showLikedBlogs });

        return res.status(200).json({
            success: true,
            message: "Visibility updated",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}


module.exports = {
    createUser,
    login,
    getUser,
    getUserById,
    updateUser,
    deleteUser,
    verifyEmail,
    googleAuth,
    followUser,
    changeSavedLikedBlog
};