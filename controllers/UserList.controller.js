import xlsx from 'xlsx';
import fs from 'fs';
import { UserList } from '../models/userlist.model.js'; // Ensure curly braces if exported as named
import { ConfirmList } from '../models/confirmUser.model.js';
import { User } from '../models/admin.model.js';
import {sendEmail, sendVerifyEmail}  from './emailTemplate.js';
import { VerifyId, VerificationCode } from '../controllers/util/Helper.js'; // adjust path
import { VerifyConfirm } from './emailhtml.js';

const normalizeKeys = (obj) => {
  const newObj = {};
  for (const key in obj) {
    const newKey = key.trim().replace(/\s+/g, ''); // Remove spaces
    newObj[newKey] = obj[key];
  }
  return newObj;
};

export const uploadData = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Read and parse .xlsm file
    const workbook = xlsx.readFile(req.file.path, { bookVBA: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawJsonData = xlsx.utils.sheet_to_json(worksheet);

    // Normalize all object keys in the array
    const jsonData = rawJsonData.map(normalizeKeys);

    // Insert into MongoDB
    await UserList.insertMany(jsonData);
    fs.unlinkSync(req.file.path); // cleanup uploaded file

    res.status(200).json({
      message: 'Data uploaded successfully',
      count: jsonData.length,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error processing file',
      error: error.message,
    });
  }
};


export const fetchUserList = async (req, res) => {
  try {
    // Fetch all users, newest first
    const users = await UserList.find().sort({ createdAt: -1 });

    // Count users by status
    const confirmUser = await UserList.countDocuments({ status: "Confirm" });
    const pendingUser = await UserList.countDocuments({ status: "pending" });
    const totalUser = await UserList.countDocuments();

    res.status(200).json({
      message: 'User list fetched successfully',
      data: users,
      stats: {
        confirmUser,
        pendingUser,
        totalUser
      }
    });
  } catch (error) {
    console.error("fetchUserList error:", error);
    res.status(500).json({
      message: 'Error fetching user list',
      error: error.message
    });
  }
};

export const selectConfirmUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    // Prevent duplicate confirmation
    const alreadyConfirmed = await ConfirmList.findOne({ original_id: id });
    if (alreadyConfirmed) {
      return res.status(400).json({ message: "User already confirmed" });
    }

    // Confirm the user in UserList
    const findUser = await UserList.findByIdAndUpdate(
      id,
      { status: "Confirm" },
      { new: true }
    );

    if (!findUser) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const FullName = findUser.FullName;
    const email = findUser.EmailAddress;
    // const status = findUser.
    const verifyId = await VerifyId(); // Must return unique 6-digit
    const verificationCode = await VerificationCode(); // Must return unique 6-digit

    // Save in ConfirmList
    const addUser = new ConfirmList({
      name: FullName,
      email,
      VerifyId: verifyId,
      VerificationCode: verificationCode,
      status: findUser.status,
      original_id: findUser._id,
    });

    await addUser.save();

    // Send confirmation email
    await sendEmail({
      email:email,
      FullName,
      VerifyId: verifyId,
      VerificationCode: verificationCode,
    });

    return res.status(200).json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("selectConfirmUser error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const fetchConfirmUser = async (req, res) => {
  try {
    const fetchAllConfirmUser = await ConfirmList.find().populate(
      "original_id",
      "FullName EmailAddress City State MobileNumber"
    );

    if (fetchAllConfirmUser.length === 0) {
      return res.status(404).json({ message: "No confirmed users found" });
    }

    res.status(200).json({
      message: "Successfully fetched confirmed users",
      users: fetchAllConfirmUser,
    });
  } catch (error) {
    console.error("fetchConfirmUser error", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const addUser = async (req, res) => {
  try {
    const {
      EmailAddress,
      FullName,
      City,
      State,
      MobileNumber,
      ProspectiveBride,
      Attendingweddinginfuture,
      Whatcategoriesareyouinterestedin,
      CoutureDesignerlabelsyouwouldbeinterestedinvisiting,
      ExquisiteJewellerybrandsyouwouldbeinterestedinvisiting,
      TentativeSpendingBudget,
      Whenwouldyouliketobookyourappointment,
      PreferredTimeSlot,
    } = req.body;

    // Validate required fields
    if (
      !EmailAddress || !FullName || !City || !State || !MobileNumber ||
      !ProspectiveBride || !Attendingweddinginfuture || !Whatcategoriesareyouinterestedin ||
      !CoutureDesignerlabelsyouwouldbeinterestedinvisiting || !ExquisiteJewellerybrandsyouwouldbeinterestedinvisiting ||
      !TentativeSpendingBudget || !Whenwouldyouliketobookyourappointment || !PreferredTimeSlot
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create and save the new user
    const newUser = new UserList({
      EmailAddress,
      FullName,
      City,
      State,
      MobileNumber,
      'Prospective/Bride':ProspectiveBride,
      Attendingweddinginfuture,
      Whatcategoriesareyouinterestedin,
      CoutureDesignerlabelsyouwouldbeinterestedinvisiting,
      ExquisiteJewellerybrandsyouwouldbeinterestedinvisiting,
      TentativeSpendingBudget,
      Whenwouldyouliketobookyourappointment,
      PreferredTimeSlot,
      status: "pending"  // Optional: set default status
    });

    await newUser.save();

    return res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    console.error("addUser error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const FatchUserDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const findUser = await UserList.findById(id);

    if (!findUser) {
      return res.status(404).json({ message: "User not found" }); // 404 is better here
    }

    res.status(200).json({ message: "Fetched successfully", data: findUser });

  } catch (error) {
    console.error("FatchUserDetail error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchPendingUser = async (req, res) => {
  try {
    const users = await UserList.find({ status: "pending" });

    if (users.length === 0) {
      return res.status(404).json({ message: "No pending users found" });
    }

    res.status(200).json({ message: "Fetched successfully", users });
  } catch (error) {
    console.error("fetchPendingUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const AllUserData = async (req, res) => {
  try {
    const totalUser = await UserList.countDocuments();
    const pendingUser = await UserList.countDocuments({ status: "pending" });
    const confirmUser = await UserList.countDocuments({ status: "Confirm" });

    res.status(200).json({
      message: "Data fetched successfully",
      totalUser,
      pendingUser,
      confirmUser
    });
  } catch (error) {
    console.log("AllUserData error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const FatchAdminDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const findAdmin = await User.findById(userId).select('-password'); // corrected line
    res.status(200).json({ message: "Admin detail fetched successfully", findAdmin });
  } catch (error) {
    console.log("FatchAdminDetails", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const deletedUser = await UserList.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DeleteUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const CancelUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Find the confirmed user by ID
    const confirmedUser = await ConfirmList.findById(id).select("+original_id");

    // ❌ If not found, return error
    if (!confirmedUser) {
      return res.status(400).json({ message: "Invalid User" });
    }

    // ✅ Get the original user ID
    const userId = confirmedUser.original_id;

    // ✅ Update user status to "pending"
    await UserList.findByIdAndUpdate(userId, { status: "pending" }, { new: true });

    // ✅ Delete from ConfirmList
    await ConfirmList.findByIdAndDelete(id);
    
    // ✅ Success response
    res.status(200).json({ message: "User cancelled successfully" });

  } catch (error) {
    console.error("CancelUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const VerifyUserDetails = async (req, res) => {
  try {
    const { email, VerifyId, VerificationCode } = req.params;

    if (!email || !VerifyId || !VerificationCode) {
      return res.status(400).send(`<h2>All fields are required</h2>`);
    }

    const findUser = await ConfirmList.findOne({ email, VerifyId, VerificationCode });

    if (!findUser) {
      return res.send(`<h2>Invalid User</h2>`);
    }

    return res.send(`
      <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px; display: flex; justify-content: center;">
        <div style="max-width: 500px; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <div style="padding: 30px; text-align: center;">
            <h2 style="color: #333;">Verify Your Email</h2>
            <p style="font-size: 16px; color: #666;">We received a request to verify your email account.</p>

            <div style="margin: 20px 0; text-align: left; font-size: 15px; color: #444;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Verification ID:</strong> ${VerifyId}</p>
              <p><strong>Verification Code:</strong> ${VerificationCode}</p>
            </div>

            <button id="submit" 
              style="background-color: #4CAF50; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; cursor: pointer;">
              Confirm Now
            </button>
          </div>
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
      <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
      <script>
        document.getElementById("submit").addEventListener('click', async () => {
          try {
            const button = document.getElementById("submit");
            button.disabled = true;
            const response = await axios.get("https://pop-7h18.onrender.com/user/verifyconfirmuser/${email}/${VerifyId}/${VerificationCode}");

            if (response.status === 200) {
              Toastify({
                text: "User Verified Successfully",
                duration: 2000,
                gravity: "top",
                position: "right",
                backgroundColor: "green",
              }).showToast();
              // Optional: redirect or refresh
              setTimeout(() => {
  window.location.href = "http://localhost:5173"
}, 2000);

            } else if(response.status==400) {
              Toastify({
                text: response.data.message,
                duration: 2000,
                gravity: "top",
                position: "right",
                backgroundColor: "red",
              }).showToast();
              button.disabled = false;
            }
          } catch (error) {
            Toastify({
              text: "Error verifying user",
              duration: 2000,
              gravity: "top",
              position: "right",
              backgroundColor: "red",
            }).showToast();
            console.log("VerifyUser error", error);
            document.getElementById("submit").disabled = false;
          }
        });
        
      </script>
    `);
  } catch (error) {
    console.log("VerifyUserDetails error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const VerifyConfirmUser = async (req, res) => {
  try {
    const { email, VerifyId, VerificationCode } = req.params;

    // Validate input fields
    if (!email || !VerifyId || !VerificationCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = await ConfirmList.findOne({ email, VerifyId, VerificationCode });
    if (!user) {
      return res.status(400).json({ message: "Invalid User" });
    }

    // Check if already verified
    if (user.verify) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Update verification status
    const updatedUser = await ConfirmList.findOneAndUpdate(
      { email, VerifyId, VerificationCode },
      { verify: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Failed to verify user" });
    }

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error("VerifyConfirmUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const FetchConfirmVerityUser = async (req, res) => {
  try {
    const findUser = await ConfirmList.find({ verify: true }); // corrected 'verity' to 'verify'

    if (!findUser || findUser.length === 0) {
      return res.status(404).json({ message: "No verified users found" });
    }
    
    return res.status(200).json({
      message: "Verified users fetched successfully",
      users: findUser,
    });
    
  } catch (error) {
    console.error("FetchConfirmVerifyUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

