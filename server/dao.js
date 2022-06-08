'use strict';
/* Data Access Object (DAO) module for accessing exams */

const sqlite = require('sqlite3');
const {Exam} = require('./exam');
//const dayjs = require("dayjs");
const { resolve } = require('path');

const db = new sqlite.Database('studyPlan.db', err => {
  if (err) throw err;
});

exports.listAllExam = () => {
  return new  Promise(async (resolve, reject) => {
    const sql = 'SELECT * FROM exam ORDER BY code';

    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else {
        const exams = rows.map(row =>
            new Exam(
                row.code,
                row.name,
                row.credits,
                row.max,
                row.preparation,
                row.description
            ))
        resolve(exams);
      }
    })
  });

}
 exports.getIncompatible = (code)=>{
  return new Promise((resolve, reject) => {
    const sql="SELECT code2 FROM incompatible WHERE code1=?"
    db.all(sql,[code],(err,rows)=>{
      if(err) reject(err);
      else{
        if(rows===[]){
          resolve(null)
        }
        else{
          const inc=[];
          rows.map(r=> inc.push(r));
          resolve(inc);
        }
      }
    })
  })


}


exports.getExamByCode = (code) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM exam WHERE code=?';
    db.get(sql, code, (err, row) => {
      if (err) reject(err);
      else {
        if(row) {
          const exam = new Exam(
            row.code,
            row.name,
            row.credits,
            row.max,
            row.preparation,
            row.description
          )
          resolve(exam);
        }
        else {
          reject(row);
        }
      }
    })
  });

}
exports.getPlanByUserId=async(Id)=>{
  return new Promise((resolve, reject) => {
    const sql2="SELECT id from plan WHERE userId=?";
    db.get(sql2, Id, (err, row) => {
      if (err) reject(err);
      else {
        let planId;
        if(row) {
          planId=row.id;
        }
        resolve(planId);
      }
    });

  })
}
exports.insertExam=(id,code)=>{
  return new Promise((resolve,reject)=>{
    const sql = "INSERT INTO planExam(id,code) VALUES (?, ?)";
    console.log(code);
    console.log(id);
    db.run(sql, [id,code], (err) => {// inserisco esame dentro piano di studio
      if (err)
        reject(err);
      else
        resolve(this.lastID);
    });

  })
}

exports.deleteExam=(id,code)=>{
  return new Promise((resolve,reject)=>{
    const sql = "DELETE FROM planExam WHERE code=? and id=?";
    db.run(sql, [code,id], (err) => {// inserisco esame dentro piano di studio
      if (err)
        reject(err);
      else
        resolve(this.lastID);
    });

  })
}

exports.addExamPlan =async (exams,userId) => {
  return new Promise(async (resolve, reject) => {
        const sql3= "UPDATE plan SET credits= credits + ? WHERE id=?"
        let planId;
        try{
           planId = await this.getPlanByUserId(userId);
        }catch(err){
          throw err;
        }
        let credits=0;
        for(const i of exams){
          
          await this.insertExam(planId,i.code)
          credits+=i.credits;
        }
        db.run(sql3, [credits,planId], (err) => { //aggiorno piano distudio con crediti dell'esame
          if (err)
            reject(err);
          else
            resolve(this.lastID);
        });
      }
  );

}//new plan(set type)

exports.NewPlan = (type,userId) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO plan(type,credits,userId) VALUES(?,?,?)";
    db.run(sql, [type,0,userId], (err) => {
      if (err)
        reject(err);
      else
         
        resolve(this.lastID)
    })
  });
}

//delete exam from plan

exports.deleteExamPlan =async (exams,userId) => {
  return new Promise(async (resolve, reject) => {
       
        const sql2="SELECT id from plan WHERE userId=?";
        const sql3= "UPDATE plan SET credits= credits - ? WHERE id=?"
        let planId;
        try{
           planId = await this.getPlanByUserId(userId);
       }catch(err){
         throw err;
       }
       let credits=0;
        for(const i of exams){
          await this.deleteExam(planId,i.code)
          credits+=i.credits;
        }    
        db.run(sql3, [credits,planId], (err) => { //aggiorno piano distudio con crediti dell'esame
          if (err)
            reject(err);
          else
            resolve(this.lastID);
        });
      }
  );
}
exports.deletePlan=(id)=>{
  return new Promise((resolve,reject)=>{
    const sql="DELETE FROM plan WHERE id=?";
    db.run(sql, [id], (err) => {// elimino plan 
      if (err)
        reject(err);
      else
        resolve(this.lastID);
    });
  })
}

exports.login = (film,user) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT hash FROM users WHERE email=?";
    db.get(sql, [user.email], (err) => {
      if (err)
        reject(err);
      else{
          // TODO: resolve
          if(row) {
            let pwd=row.hash;
            //check pwd hash
          }
          resolve(planId);
        }
    })
  });
}

exports.addExam=(exam) =>{
  return new Promise((resolve,reject)=> {
    const sql="INSERT INTO exam(code,name,credits,max,preparation,description) VALUES(?,?,?,?,?,?)";
    db.run(sql,[exam.code,exam.name,exam.credits,exam.max,exam.preparation,exam.descriptiom],(err)=>{
      if(err)
        reject(err);
        else{
          resolve(this.lastID)
        }
    })
  })
}

exports.addDefaultExam=async ()=>{
  let exam=new Exam("02GOLOV","Architetture dei sistemi di elaborazione",12,null,null,null);
  await this.addExam(exam);
  let exam1=new Exam("02LSEOV","Computer architectures",12,null,null,null);
  await this.addExam(exam1);
  let exam2=new Exam("01SQJOV","Data Science and Database Technology",8,null,null,null);
  await this.addExam(exam2);
  let exam3=new Exam("01SQMOV","Data Science e Tecnologie per le Basi di Dati",8,null,null,null);
  await this.addExam(exam3);
  let exam4=new Exam("01SQLOV","Database systems",8,null,null,null);
  await this.addExam(exam4);
  let exam5=new Exam("01OTWOV","Computer network technologies and services",6,3,null,null);
  await this.addExam(exam5);
  let exam6=new Exam("02KPNOV","Tecnologie e servizi di rete",6,3,null,null);
  await this.addExam(exam6);
  let exam7=new Exam("01TYMOV","Information systems security services",12,null,null,null);
  await this.addExam(exam7);
  let exam8=new Exam("01UDUOV","Sicurezza dei sistemi informativi",12,null,null,null);
  await this.addExam(exam8);
  let exam9=new Exam("05BIDOV","Ingegneria del software",6,null,"02GOLOV",null);
  await this.addExam(exam9);
  let exam10=new Exam("04GSPOV","Software engineering",6,null,"02LSEOV",null);
  await this.addExam(exam10);
  let exam11=new Exam("01UDFOV","Applicazioni Web I",6,null,null,null);
  await this.addExam(exam11);
  let exam12=new Exam("01TXYOV","Web Applications I",6,3,null,null);
  await this.addExam(exam12);
  let exam13=new Exam("01TXSOV","Web Applications II",6,null,"01TXYOV",null);
  await this.addExam(exam13);
  let exam14=new Exam("02GRSOV","Programmazione di sistema",6,null,null,null);
  await this.addExam(exam14);
  let exam15=new Exam("01NYHOV","System and device programming",6,3,null,null);
  await this.addExam(exam15);
  let exam16=new Exam("01SQOOV","Reti Locali e Data Center",6,null,null,null);
  await this.addExam(exam16);
  let exam17=new Exam("01TYDOV","Software networking",7,null,null,null);
  await this.addExam(exam17);
  let exam18=new Exam("03UEWOV","Challenge",5,null,null,null);
  await this.addExam(exam18);
  let exam19=new Exam("01URROV","Computational intelligence",6,null,null,null);
  await this.addExam(exam19);
  let exam20=new Exam("01OUZPD","Model based software design",4,null,null,null);
  await this.addExam(exam20);
  let exam21=new Exam("01URSPD","Internet Video Streaming",6,2,null,null);
  await this.addExam(exam21);


}