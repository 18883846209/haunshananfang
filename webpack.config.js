/*
 * @Author: quezhongyou 
 * @Date: 2018-09-05 11:21:36 
 * @Last Modified by: quezhongyou
 * @Last Modified time: 2018-09-05 14:55:23
 */


'use strict';
const isDev = process.env.NODE_ENV === 'development';
const config = require('./config.json');

/**
 * 
 * @param {*} option 
 * @description 全局变量插件
 */
const insertGlobalVarPlugin = function(options){
    this.SSystemString = options.SSystemString;
};
insertGlobalVarPlugin.prototype.apply = function(compiler){
    let self = this;
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
            let html = htmlPluginData.html; 
            htmlPluginData.html = html.replace(/(\<\/head\>)/,`${self.SSystemString}$1`);
            callback();
        })
    })
}


let env = {
    dev:function(webpackConfig){
        let env = 'development';
        let SSystemString = `<title>${config[env].title}</title><script>window.SSystem = ${JSON.stringify(config[env])}</script>`;
        webpackConfig.plugins.push(new insertGlobalVarPlugin({SSystemString}));
    },
    pro:function(webpackConfig){
        let env = 'production';
        let str = `<$- JSON.stringify({`
        for(let key in config[env]){
            str += `${key}:config.${env}.${key},`;
        }
       str +=`})$>`;
        let  SSystemString = `<title><$-config.${env}.title$></title>
                       <script>window.SSystem = ${str}</script>`;
        webpackConfig.plugins.push(new insertGlobalVarPlugin({SSystemString}));
    }
}

export default function(webpackConfig) {
    env[isDev?'dev':'pro'].call(null,webpackConfig);
    return webpackConfig;
}