const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Association', () => {
  let joe, blogPost, comment;
  beforeEach(done => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({
      title: 'Eloquent JavaScript',
      content: 'As programs get bigger, they also become more complex'
    });
    comment = new Comment({ content: 'Love this post' });
    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;

    Promise.all([joe.save(), blogPost.save(), comment.save()]).then(() =>
      done()
    );
  });

  it('saves a relation between a user and a blogpost', done => {
    User.findOne({ name: 'Joe' })
      .populate('blogPosts')
      .then(user => {
        assert(user.blogPosts[0].title === 'Eloquent JavaScript');
        done();
      });
  });

  it('saves a full relation graph', () => {
    User.findOne({ name: 'Joe' })
      .populate({
        path: 'blogPosts',
        populate: {
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'user',
            model: 'user'
          }
        }
      })
      .exec()
      .then(user => {
        assert(user.name === 'Joe');
        assert(user.blogPosts[0].title === 'Eloquent JavaScript');
        assert(
          user.blogPosts[0].comments[0].content ===
            'As programs get bigger, they also become more complex'
        );
        assert(user.blogPosts[0].comments[0].user.name === 'Joe');
        done();
      });
  });
});
