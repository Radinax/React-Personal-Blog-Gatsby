---
title: MERN Social Network - Server part 5 Education and Delete
date: '2020-05-09T11:53:32.169Z'
---

In this post we will work on adding the education to our profile.

## Adding Eexperience

Inside routes/api/profile add:

```javascript
// Load Input Validation
const validateExperienceInput = require("../../validation/experience");

// @route  POST api/profile/experience
// @desc   Add experience to profile
// @access Private
router.post('/experience', passport.authenticate('jwt', {session: false}, (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

    // Check validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

  Profile.findOne({user: req.user.id})
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      // Add to experinece array
      profile.experience.unshift(newExp)

      profile.save().then(profile => res.json(profile))
    })
})
```

Inside our validation/experience:

```javascript
const Validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateExperienceInput(data) {
  let errors = {}

  data.title = !isEmpty(data.title) ? data.title : ''
  data.company = !isEmpty(data.company) ? data.company : ''
  data.from = !isEmpty(data.from) ? data.from : ''

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Job title field is required'
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = 'Company field is required'
  }
  if (Validator.isEmpty(data.title)) {
    errors.title = 'From date field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
```

Now test inside api/profile/experience and add the fields title, company and from.

Lets work with education, its very similar to experience

```javascript
// Load Input Validation
const validateEducationInput = require("../../validation/education");

// @route  POST api/profile/education
// @desc   Add education to profile
// @access Private
router.post('/education', passport.authenticate('jwt', {session: false}, (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

    // Check validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

  Profile.findOne({user: req.user.id})
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldOfStudy: req.body.fieldOfStudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      // Add to education array
      profile.education.unshift(newEdu)

      profile.save().then(profile => res.json(profile))
    })
})
```

Now create the validation/education file:

```javascript
const Validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateEducationInput(data) {
  let errors = {}

  data.school = !isEmpty(data.school) ? data.school : ''
  data.degree = !isEmpty(data.degree) ? data.degree : ''
  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : ''
  data.from = !isEmpty(data.from) ? data.from : ''

  if (Validator.isEmpty(data.school)) {
    errors.school = 'School field is required'
  }
  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Company field is required'
  }
  if (Validator.isEmpty(data.fieldOfSudy)) {
    errors.fieldOfSudy = 'From date field is required'
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
```

Now test it in api/profile/experience sending a POST request and check your api/profile/current to see its added.

## Delete education and experience

Now we need to add an option for the user to delete education and experience.

```javascript
// @route  DELETE api/profile/experinece/:exp_id
// @desc   Delete experience from profile
// @access Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}, (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      // Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id)

      // Splice out of array
      profile.experience.splice(removeIndex, 1)

      // Save
      profile.save().then(profile => res.json(profile))
    })
    .catch(err => res.status(404).json(err))
})
```

Now create a new experience with a POST request in api/profile/experience and then try to DELETE sending the ID from that experience api/profile/experience/:exp_id and don't forget to add the token.

Now we get as response our profile without the test experience as result.

Lets do the same for education:

```javascript
// @route  DELETE api/profile/education/:edu_id
// @desc   Delete education from profile
// @access Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}, (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      // Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id)

      // Splice out of array
      profile.education.splice(removeIndex, 1)

      // Save
      profile.save().then(profile => res.json(profile))
    })
    .catch(err => res.status(404).json(err))
})
```

Do the same, create a new education in api/profile/education to delete it after in api/profile/education/:edu_id to test it works.

## DELETE user and profile

Inside the routes/api/profile:

```javascript
// @route  DELETE api/profile
// @desc   Delete user and profile
// @access Private

router.delete('/', passport.authenticate('jwt', {session: false}, (req, res) => {
  Profile.findOneAndRemove({user: req.user.id})
    .then(() => {
      User.findOneAndRemove({ _id: req.user.id})
        .then(() => json({ success: true }))
    })
})
```

Make a POST request in api/user/register to create a new user, then add a profile for that user, you need to login in api/user/login and use the token to make a POST request to create a profile in api/profile. Now make a DELETE request in api/profile to delete both user and profile.

That's it for profile routes!

## Summary

- We added experience and education POST request, we created a validation for each input selecting which ones are required and showing an error if there is one, then you find the user by id and send a new experience/education and save it.
- Delete requests require the experience/education ids which is generated in the DB, in this case we need to authenticate to be able to perform a DELETE request, then find the user by id, find the index and use splice to remove it from the profile.
- To delete the whole user which includes the profile, we send a DELETE request, use the id to use the mongoose method findAndRemove which takes the id and its done.

## Conclusion

For this part of the series we ended the whole profiles route. It was quite repetitive, plenty of copy and paste which is something I don't like too much.

The logic was that when a user wants perform POST requests, they can only do so when they're authorized, then they need to add the right fields otherwise they get a message from the server and to perform DELETE requests you can do it with a single request.

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
