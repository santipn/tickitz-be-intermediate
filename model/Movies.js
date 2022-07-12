// model = tempat dimana kita meletakkan data yang berhubungan dengan database
const db = require('../helper/dbConnection.js')
const fs = require('fs')

module.exports = {
    get: (req, res)=> {
      return new Promise((resolve, reject)=> {
        const offset = ((req.query.page - 1) * req.query.limit)
        const sql = `SELECT * FROM movies LIMIT ${req.query.limit} OFFSET ${offset} `
        console.log(sql)
        db.query(sql,(err, results)=> {
          if(err) {
            reject({message: "ada error"})
          }
          resolve({
            message: "get all from movies success",
            status: 200,
            data: results
          })
        })
      })
    },
    getById: (req, res)=> {
      return new Promise((resolve, reject)=> {
        const {idMovie} = req.params
        const sql = `SELECT * FROM movies WHERE idMovie=${idMovie}`
        db.query(sql,(err, results)=> {
          if(err) {
            console.log(err)
            reject({message: "ada error"})
          }
          resolve({
            message: "get all movies by id success",
            status: 200,
            data: results
          })
        })
      })
    },
    add: (req, res)=> {
      return new Promise((resolve, reject)=> {
        const {title, cover, releaseDate, director, synopsis, duration, casts, categories} = req.body
        console.log(req.body, 'ngeeeeeng')
        db.query(`INSERT INTO movies(title, cover, releaseDate, director, synopsis, duration, casts, categories) VALUES ('${title}','${cover}','${releaseDate}','${director}','${synopsis}','${duration}','${casts}','${categories}')`, 
        (err, results)=> {
          if(err) {
            console.log(err)
            reject({message: "ada error"})
          }
          resolve({
            message: "add new movies success",
            status: 200,
            // data: {
            //   id: results.insertId,
            //   ...req.body,
            // }
            data: results
          })
        })
      })
    },
    update: (req, res) => {
      return new Promise((resolve, reject)=> {
        const {idMovie} = req.params
        db.query(`SELECT * FROM movies where idMovie=${idMovie}`,(err, results)=> {
          if(err) {res.send({message: "ada error"})}
      
          const previousData = {
            ...results[0],
            ...req.body
          }
          const {title, cover, releaseDate, director, synopsis, duration, casts, categories} = previousData
          
          const tempImg = results[0].cover
          console.log(tempImg)
          if(req.body.cover){
            fs.unlink(`uploads/${tempImg}`, function (err){
              if(err) {
                reject({
                  message: "ada error",
                })
                console.log(err)
              }
            })
          }

          db.query(`UPDATE movies SET title='${title}', cover='${cover}', releaseDate='${releaseDate}', director='${director}', synopsis='${synopsis}', duration='${duration}', casts='${casts}', categories='${categories}' WHERE idMovie=${idMovie}`,(err, results)=> {
            if(err) {
              console.log(err)
              reject({message: "ada error"})
            }
            resolve({
              message: "update movies success",
              status: 200,
              data: results
            })
          })
          
        })
      })
    },
    // remove:(req, res)=> {
    //   return new Promise((resolve, reject)=> {
    //     const {idMovie} = req.params
    //     db.query(`DELETE FROM movies where idMovie=${idMovie}`,(err, results)=> {
    //       if(err) {reject({message: "ada error"})}
    //       resolve.send({
    //         message: "delete movies success",
    //         status: 200,
    //         data: results
    //       })
    //     })
    //   })
    // },
    remove: (req, res) => {
      // delete done
      return new Promise((resolve, reject) => {
        const { idMovie } = req.params;
        db.query(`SELECT cover FROM movies WHERE idMovie=${idMovie}`, (err, results) => {
          if(!results.length){
            reject({ message: "Data id not found" });
          }else{
            const tempImg = results[0].cover
            db.query(
              `DELETE FROM movies WHERE idMovie=${idMovie}`,
              (err, results) => {
                if (err) {
                  console.log(err);
                  reject({ message: "Something wrong" });
                }
                fs.unlink(`uploads/${tempImg}`, function (err){
                  if(err){
                    resolve({
                      message: "Delete movies success",
                      status: 200,
                      data: results,
                    });
                  }
                  resolve({
                    message: "Delete movies success",
                    status: 200,
                    data: results,
                  });
                })
              }
            );
          }
        })
      });
    },
    
    searchMovie: (req, res)=> {
      return new Promise((resolve, reject)=> {
        const {title='', director=''} = req.query
        const sql = `SELECT * FROM movies WHERE title LIKE '%${title}%' ` 
        db.query(sql,(err, results)=> {
          console.log(title)
          if(err) {
            console.log(err)
            reject({message: "ada error"})
          }
          resolve({
            message: "search success",
            status: 200,
            data: results
          })
        })
      })
    },
    sortMovie: (req, res)=> {
      return new Promise((resolve, reject)=> {
        const sql = `SELECT * FROM movies ORDER BY ${req.query.order} ASC` 
        db.query(sql,(err, results)=> {
          if(err) {
            console.log(err)
            reject({message: "ada error"})
          }
          resolve({
            message: "sort movies success",
            status: 200,
            data: results
          })
        })
      })
    }
}
