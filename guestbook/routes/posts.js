var express = require('express'); // express 모듈을 쓸 것이다. 
var Post = require('../models/Post'); // model에 있는 Post.js (MongoDB에 있는 데이터를 가져옴)
var router = express.Router(); // express 모듈의 Router를 쓰겠다. 

function validateForm(form, options) {
  var email = form.email || "";
  var title = form.title || "";
  var content = form.title || "";
  var password = form.password || "";

  email = email.trim(); //trim(): remove whitespace
  title = title.trim();
  content = content.trim();

  if (!email) {
    return 'email을 입력해주세요.';
  }

  if (!title) {
    return 'title을 입력해주세요.';
  }

  if (!password && options.needPassword) {
    return '비밀번호를 입력해주세요.';
  }

  return null;
}

//GET post list (게시글 목록)
// '/' = http://localhost:3000
router.get('/', function(req, res, next) {
  Post.find({}, function(err, posts) { // find의 매개변수는 객체와 옵션 그리고 콜백함수이다. {}는 모든 객체를 의미한다.
    if (err) {
      return next(err);
    }
    res.render('posts/index', {posts: posts}); //posts 데이터를 보내면서 posts/index를 렌더링 -> 글의 목록들을 보여준다. 
  });
});

// 글쓰기(게시판 목록 추가)
router.get('/new', function(req, res, next){ // 글쓰기 버튼을 누른경우 글 추가
 Post.find({}, function(err, post) {  
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});  // 글 쓰는 페이지로 이동한다. 
  });
});

// 수정
router.get('/:id/edit', function(req, res, next){ // 글을 수정할 경우
  Post.findById({_id:req.params.id}, function(err, post){ // id별로찾음(해당 Document가 가지고 있는 id로 )
    if(err){
      return next(err);
    } 
    res.render('posts/edit', {post: post, messages: req.flash()}); 
    // put method에서 비밀번호를 잘못 입력하면 redirect('back')을 하는 데
    // 이는 posts/edit으로 돌아오게 하는 결과를 낳는다.
    // 그리고 비밀번호가 잘못되었다는 flash message를 보내준다. 
    // 따라서 여기서 flash 메세지를 보내준다. 
  })
});

// 상세보기
// /:id는 parameter
router.get('/:id', function(req, res, next) {
  Post.findById({_id:req.params.id}, function(err, post) {
    if (err) {
      return next(err);
    }
    // 상세 보기
    res.render('posts/show', {post: post}); 
  });
});

// 삭제
router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove({_id: req.params.id}, function(err, post) {
    if (err) {
      return next(err);
    }
  });
  Post.find({}, function(err, posts){
     res.render('posts/index', {posts: posts}); // 목록으로 돌아감
  });
});

// 글 쓰기
router.post('/', function(req, res, next){
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
    var newPost = new Post({ // POST 에서는 새로운 포스트를 또 저장해야 하므로 newPost 라는 새로운 객체로 만든다. 
        email: req.body.email,
        title: req.body.title,
        content: req.body.content,
        read: req.body.read,
        password: req.body.password
    });
    
    newPost.save(function(err, post){
        if(err){
            return next(err);
        }else{
            res.render('posts/show', {post: post});
        }
    })
});

// 글 수정 
router.put('/:id', function(req, res, next){
   Post.findById({_id: req.params.id}, function(err, post) {
      if (err) {
        return next(err);
      }
      post.content = req.body.content; // PUT에서는 content만 수정하므로 이 부분만 써주면 된다. 

      post.save(function(err, post){
        if(err){
            return next(err);
        }else if(post.password != req.body.password){
          req.flash('danger', '비밀 번호가 옳지 않습니다.'); // 원래 추가해보려고 했으나 포기
          res.redirect('back'); // 하지만 비밀번호가 일치하지 않는다면 뒤로 다시 돌아감. 
        }else{
            res.render('posts/show', {post : post, });
        }
      });
   });
});



module.exports = router;