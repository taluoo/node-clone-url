const fs = require('fs');
const Path = require('path');
const {URL} = require('url');
const Util = require('util');
const renameFile = Util.promisify(fs.rename);

const mkdirp = require('mkdirp');

const download = require('@taluoo/download');
const deleteTmpFile = require('@taluoo/tmpfile').deleteTmpFile;
const MD5 = require('@taluoo/md5');

/**
 * 下载 URL，并按照 URL 保存到指定目录，例如：
 * http://www.baidu.com/abc/index.html 下载到 ${baseDir}/www.baidu.com/abc/index.html/${md5}.html
 * @param url 目标 URL
 * @param baseDir 保存到哪里
 * @return {Promise.<*|string>} 返回保存后的路径
 */
async function clone(url, baseDir = process.cwd()) {
    if (!url) {
        throw new Error('请指定 clone 目标 URL');
    }
    try {
        // 下载并计算 md5 值
        let tmpFile = await download(url);
        let md5 = await MD5(tmpFile);

        // 将 URL 映射为文件路径，并提取后缀名
        let urlPath = url2path(url);
        let ext = Path.extname(urlPath);

        // 创建目录
        let targetDir = Path.join(baseDir, urlPath);
        let targetFile = Path.join(targetDir, `${md5}${ext}`);
        mkdirp.sync(targetDir);

        let hasExist = fs.existsSync(targetFile);
        if (hasExist) {// 删除临时文件
            console.log(`已存在相同文件 ${targetFile}`);
            deleteTmpFile(tmpFile);
        } else {// 移动
            await renameFile(tmpFile, targetFile);
        }
        return targetFile;
    } catch (e) {
        console.log(`clone ${url} failed`);
        throw e;
    }
}

/**
 * TODO: 动态脚本的情况，把 querystring 也保存下来
 * 把 URL 映射为文件路径
 * @param url
 * @return {*|string}
 */
function url2path(url) {
    let urlObj = new URL(url);
    if (urlObj.pathname === '/') {
        urlObj.pathname = '/index.html';
    }
    return Path.join(urlObj.host, urlObj.pathname);// 注意：其中 host 是带端口号的，https://nodejs.org/api/url.html
}

module.exports = {
    url2path,
    clone
};