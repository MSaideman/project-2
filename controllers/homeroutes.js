const router = require('express').Router();
const { Pevent, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const peventData = await Pevent.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    

// Serialize data so the template can read it
const pevents = peventData.map((pevent) => pevent.get({ plain: true }));

  // Pass serialized data and session flag into template
  res.render('homepage', { 
    pevents, 
    logged_in: req.session.logged_in 
  });
} catch (err) {
  res.status(500).json(err);
}
});

router.get('/project/:id', async (req, res) => {
  try {
    const peventData = await Pevent.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const pevent = peventData.get({ plain: true });

    res.render('project', {
      ...pevent,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// for user here
// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Pevent }],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('profile', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
  
    res.render('login');
  });


  router.get('/create', withAuth, async (req, res) => {
    try {
      res.render('create', {
        loggedIn: req.session.loggedIn,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
module.exports = router;