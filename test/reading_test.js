const assert = require('assert');
const User = require('../src/user');

describe('Reading users out of the database', () => {
  let joe, jessica, oscar, greg;

  beforeEach((done) => {
    greg = new User({ name: 'Greg' });
    oscar = new User({ name: 'Oscar' });
    jessica = new User({ name: 'Jessica' });
    joe = new User({ name: 'Joe' });

    Promise.all([greg.save(), oscar.save(), jessica.save(), joe.save()]).then(
      () => done()
    );
  });

  it('finds all users with a name of joe', (done) => {
    User.find({ name: 'Joe' }).then(users => {
      assert(users[0]._id.toString() === joe._id.toString());
      done();
    });
  });

  it('find a user with a particular id', (done) => {
    User.findOne({ _id: joe._id }).then(user => {
      assert(user.name === 'Joe');
      done();
    });
  });

  it('can skip and limit the result set', () => {

  });
});
