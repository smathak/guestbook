// 스키마 생성
var mongoose = require('mongoose'); // mongoose 모듈 
var Schema = mongoose.Schema; // Schema 생성

var schema = new Schema({
    email: String, // 이메일
    password: String, // 비밀번호
    title: String, // 제목
    content: String, // 글 내용
    createdAt: {type: Date, default: Date.now}, // 날짜
    read: Number // 조회수
});

var Post = mongoose.model('Post', schema); // Post 모델 생성 

module.exports = Post; // Post 모듈을 내보냄 