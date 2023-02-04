const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sum = blogs.reduce(function (val, curr) {
    return val + curr.likes;
  }, 0);
  return sum;
};

const favoriteBlog = (blogs) => {
  const result = blogs.reduce(function (prev, cur) {
    return prev.likes > cur.likes ? prev : cur;
  });
  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
