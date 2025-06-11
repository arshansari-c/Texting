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
UserListRouter.post('/uploaddata', upload.single('file'),CheckAuth, uploadData);
UserListRouter.post('/addmember',CheckAuth,AddMember)
UserListRouter.get('/fatchusers',CheckAuth,fetchUserList)
UserListRouter.post('/login',login)
UserListRouter.post("/logout",logout)
UserListRouter.post('/confirmuser/:id',CheckAuth,selectConfirmUser)
UserListRouter.get('/fatchconfirmuser',CheckAuth,fetchConfirmUser)
UserListRouter.post('/adduser',CheckAuth,addUser)
UserListRouter.get('/fatchuser/:id',CheckAuth,FatchUserDetail)
UserListRouter.get('/fatchpendinguser',CheckAuth,fetchPendingUser)
UserListRouter.get('/alluserdata',CheckAuth,AllUserData)
UserListRouter.get('/fatchadmindetails',CheckAuth,FatchAdminDetails)
UserListRouter.delete('/deleteuser/:id',CheckAuth,DeleteUser)
UserListRouter.get('/canceluser/:id',CheckAuth,CancelUser)
UserListRouter.get('/verifyuserdetail/:email/:VerifyId/:VerificationCode',CheckAuth,VerifyUserDetails)
UserListRouter.get('/verifyconfirmuser/:email/:VerifyId/:VerificationCode',CheckAuth,VerifyConfirmUser)
UserListRouter.get('/fetchverifyuser',CheckAuth,FetchConfirmVerityUser)
// UserListRouter.post('/addmember',AddMember)

export default UserListRouter;
