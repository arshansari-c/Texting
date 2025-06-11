import express from 'express';
import multer from 'multer';
import { uploadData,fetchUserList, selectConfirmUser,fetchConfirmUser, addUser, FatchUserDetail,fetchPendingUser, AllUserData, FatchAdminDetails, DeleteUser, CancelUser, VerifyConfirmUser, FetchConfirmVerityUser, VerifyUserDetails } from '../controllers/UserList.controller.js';
import { AddMember, login, logout } from '../controllers/Admin.controller.js';
import { CheckAuth } from '../middlewares/checkAuth.js';

// import { AddMember } from '../controllers/Admin.controller.js';

const UserListRouter = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Allow only Excel files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.ms-excel' ||          // .xls
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // .xlsx
      file.mimetype === 'application/vnd.ms-excel.sheet.macroEnabled.12') { // .xlsm
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed (.xls, .xlsx, .xlsm)!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Route to upload and insert data to MongoDB
UserListRouter.post('/uploaddata', upload.single('file'), uploadData);
UserListRouter.post('/addmember',AddMember)
UserListRouter.get('/fatchusers',fetchUserList)
UserListRouter.post('/login',login)
UserListRouter.post("/logout",logout)
UserListRouter.post('/confirmuser/:id',selectConfirmUser)
UserListRouter.get('/fatchconfirmuser',fetchConfirmUser)
UserListRouter.post('/adduser',addUser)
UserListRouter.get('/fatchuser/:id',FatchUserDetail)
UserListRouter.get('/fatchpendinguser',fetchPendingUser)
UserListRouter.get('/alluserdata',AllUserData)
UserListRouter.get('/fatchadmindetails',FatchAdminDetails)
UserListRouter.delete('/deleteuser/:id',DeleteUser)
UserListRouter.get('/canceluser/:id',CancelUser)
UserListRouter.get('/verifyuserdetail/:email/:VerifyId/:VerificationCode',VerifyUserDetails)
UserListRouter.get('/verifyconfirmuser/:email/:VerifyId/:VerificationCode',CheckAuth,VerifyConfirmUser)
UserListRouter.get('/fetchverifyuser',CheckAuth,FetchConfirmVerityUser)
// UserListRouter.post('/addmember',AddMember)

export default UserListRouter;
