/**
 * Fork from https://github.com/jdesboeufs/necmergitur-erp
 */

const parse = require('csv-parse');
const request = require('request');
const through2 = require('through2');
const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('import');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');

const mongoConnection = MongoClient.connect(process.env.MONGODB_URL || 'mongodb://mongo/necmergitur-erp');

mongoConnection.then(() => debug('connection established'));

const types = ['J', 'L', 'O', 'PA', 'R', 'S', 'U', 'V', 'X'];

function cleanData(db) {
    const clean = db.collection('erp').remove({});
    clean.then(() => debug('all data cleaned'));
    return clean;
}

function loadData(db) {
    return Promise.each(types, type => {
        return new Promise((resolve, reject) => {
            debug('will load type: %s', type);
            //request(`https://raw.githubusercontent.com/IGNF/hackathon-necmergitur/master/collecte/CSV/${type}.csv`)
            fs.createReadStream(path.resolve(process.cwd()+`/../collecte/CSV/${type}.csv`))
                .pipe(parse({ delimiter: ';', columns: true }))
                .pipe(through2.obj((data, enc, callback) => {
                    if (!data.nom) return callback();
                    if (isNaN(parseFloat(data.lon)) || isNaN(parseFloat(data.lat))) return callback();
                    debug('import %s', data.nom);
                    db.collection('erp').insertOne({
                        label: data.nom,
                        addresse: data.adresse,
                        position: {
                            type: 'Point',
                            coordinates: [parseFloat(data.lon), parseFloat(data.lat)]
                        },
                        activity: data.activite,
                        abstract: 'No description',
                        type: data.type,
                        category: data.categorie
                    }, callback);
                }))
                .on('error', err => reject(err))
                .on('end', () => {
                    debug('dataset loaded');
                    resolve();
                })
                .resume();
        });
    });
}

function ensureIndex(db) {
    const indexCreation = db.collection('erp').ensureIndex({ position: '2dsphere' });
    indexCreation.then(() => debug('spatial index created'));
    return indexCreation;
}

module.exports = function(callback){
mongoConnection
    .then(db => {
        return cleanData(db)
            .then(() => loadData(db))
            .then(() => ensureIndex(db));
    })
    .then(() => {
        debug('has finished!')
//        process.exit(0);
       callback(null);
    })
    .catch(err => {
        console.error(err);
        //process.exit(1);
        callback(err);
    });
}