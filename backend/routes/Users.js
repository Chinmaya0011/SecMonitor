const{login,signup,  getProfile,
  getAllProfile,deleteAllUsers}=require('../controllers/Users')
const{protect}=require('../middleware/auth')
const router=require('express').Router();

router.post('/login',login);
router.post('/signup',signup);
router.get('/profile',protect,getProfile);
router.get('/allprofile',getAllProfile);
router.delete('/allusers',deleteAllUsers);

module.exports=router;