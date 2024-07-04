const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    let testBoardId = 'testBoard';
    let testThread = null;
    let testReply = {
        text: 'test reply',
        delete_password: 'password'
    }

    test('Create new thread', (done) => {
        chai.request(server)
            .post(`/api/threads/${testBoardId}`)
            .send({ text: 'test thread', delete_password: 'password', replies: [testReply] })
            .end((err, res) => {
                assert.equal(res.status, 200);
                testThread = res.body;
                done()
            });
    })

    test('Viewing the 10 most recent threads with 3 replies each', (done) => {
        chai.request(server)
            .get(`/api/threads/${testBoardId}`)
            .end((err, res) => {
                assert.equal(res.status, 200);
                done()
            });
    });

    test('Reporting a thread', (done) => {
        chai.request(server)
            .put(`/api/threads/${testBoardId}`)
            .send({ thread_id: testThread })
            .end((err, res) => {
                assert.equal(res.text, 'reported');
                done()
            });
    });

    test('Creating a new reply', (done) => {
        chai.request(server)
            .post('/api/replies/testBoardId')
            .send({ thread_id: testThread, text: 'test reply', delete_password: 'password' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                done()
            });
    });

    test('Viewing a single thread with all replies', (done) => {
        chai.request(server)
            .get(`/api/replies/${testBoardId}`)
            .query({ thread_id: testThread._id })
            .end((err, res) => {
                if(err) console.log(err);
                assert.equal(res.status, 200);
                done()
            });
    });

    test('Reporting a reply', (done) => {
        chai.request(server)
            .put(`/api/replies/${testBoardId}`)
            .send({ thread_id: testThread._id, reply_id: testThread.replies[0] })
            .end((err, res) => {
                assert.equal(res.text, 'reported');
                done()
            });
            
    });


    test('Deleting a reply with the incorrect password', (done) => {
        chai.request(server)
            .delete(`/api/replies/${testBoardId}`)
            .send({ thread_id: testThread._id, reply_id: testThread.replies[0]._id, delete_password: 'wrongPassword' })
            .end((err, res) => {
                assert.equal(res.text, 'incorrect password');
                done()
            });
    });

    test('Deleting a reply with the correct password', (done) => {
        chai.request(server)
            .delete(`/api/replies/${testBoardId}`)
            .send({ thread_id: testThread._id, reply_id: testThread.replies[0]._id, delete_password: 'password' })
            .end((err, res) => {
                assert.equal(res.text, 'success');
                done()
            });
    });

    test('Deleting a thread with the incorrect password', (done) => {
        chai.request(server)
            .delete(`/api/threads/${testBoardId}`)
            .send({ thread_id: testThread._id, delete_password: 'wrongPassword' })
            .end((err, res) => {
                assert.equal(res.text, 'incorrect password');
                done()
            });
    });

    test('Deleting a thread with the correct password', (done) => {
        chai.request(server)
            .delete(`/api/threads/${testBoardId}`)
            .send({ thread_id: testThread._id, delete_password: 'password' })
            .end((err, res) => {
                assert.equal(res.text, 'success');
                done()
            });
    });


})
