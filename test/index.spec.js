"use strict";
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

const {url2path, clone} = require('../index');

describe('index.js', () => {
    it('should export two function', () => {
        url2path.should.be.a('function');
        clone.should.be.a('function');
    });

    describe('url2path()', () => {
        it('should add index.html when pathname = /', () => {
            ['https://www.baidu.com', 'https://www.baidu.com/'].forEach(url => {
                let path = url2path(url);
                path.should.be.a('string');
                path.should.be.equal('www.baidu.com/index.html');
            });
        });
        it('should return correct path', () => {
            let path = url2path('https://www.baidu.com/abc/a.js?a=1');
            path.should.be.a('string');
            path.should.be.equal('www.baidu.com/abc/a.js');

            let path2 = url2path('http://www.baidu.com:9000/def/efg/a.html?a=2#b=c');
            path2.should.be.a('string');
            path2.should.be.equal('www.baidu.com:9000/def/efg/a.html');
        })
    });

    describe('clone(url, baseDir)', () => {
        it('should throw error when no url', async function () {
            try {
                await clone();
            } catch (e) {
                e.message.should.include('请指定 clone 目标 URL')
            }
        });
        it('should return a promise', async () => {
            let promise = clone('https://www.baidu.com/abc/a.js', __dirname);
            promise.should.be.a('promise')
            // todo: 清理 URL
        });
        // todo: 更多测试
    })
});