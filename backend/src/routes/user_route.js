import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
} from '../controllers/user_controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

//all route have not been tested yet

router.get('/test', test);  //ok

//do i need both put and post??
router.put('/update/:userId', verifyToken, updateUser); //ok
router.post('/update/:userId', verifyToken, updateUser); //ok

router.delete('/delete/:userId', verifyToken, deleteUser); //ok
router.get('/signout', signout); //ok

router.get('/getusers', verifyToken, getUsers);  //  not tested yet 
router.get('/:userId', getUser);  //ok

export default router;