let express = require("express");
var app = express();
app.use(express.json());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
    next();
});

var port = process.env.PORT || 2450;
app.listen(port,()=> console.log(`Node app listening on port ${port}!`));

let {customers,students,courses,faculties,classes} = require("./studentApiData.js");

 app.post("/login",function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    let cust = customers.find((ele)=> ele.email===email && ele.password===password);
    console.log(cust);
    var custRes = {
        name : cust.name,
        email : cust.email,
        role : cust.role
    }
    res.send(custRes);
 });

 app.post("/register",function(req,res){
   let role = req.body.role.toLowerCase()
   let mx = customers.reduce((acc,cur)=> acc>cur.custId?acc:acc=cur.custId,0);
    const cust={
        custId :mx+1,
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        role : role
    };
    customers.unshift(cust);
    if(role==="student"){
      let MaxId = students.reduce((acc,cur)=> acc>cur.id?acc:acc=cur.id,0);
      let ar = {}
      ar.id = MaxId +1;
      ar.name = req.body.name;
      ar.courses= [];
      students.unshift(ar);
    }
    if(role==="faculty"){
      let MaxId = faculties.reduce((acc,cur)=> acc>cur.id?acc:acc=cur.id,0);
      let a = {}
      a.id = MaxId+1;
      a.name = req.body.name;
      a.courses = [];
      faculties.unshift(a);
    }
    const ragisterRes = {
        name : req.body.name,
        role : req.body.role,
        email : req.body.email,
    }
    res.send(ragisterRes);
 });

 app.get("/getCourses",function(req,res){
    res.send(courses);
 });

 app.get("/getStudentNames",function(req,res){
    let ar = [];
    ar = students.reduce((acc,cur)=> acc.findIndex((ele)=>cur.name===ele)>=0?acc:[...acc,cur.name],[]);
    res.send(ar);
 });

 app.get("/getCourseByNames/:id",function(req,res){
   let id = +req.params.id;
   let str = courses.find((ele)=> +ele.courseId === id);
   res.send(str);
});

 app.get("/getFacultyNames",function(req,res){
    let ar = [];
    ar = faculties.reduce((acc,cur)=> acc.findIndex((ele)=>cur.name===ele)>=0?acc:[...acc,cur.name],[]);
    res.send(ar);
 });

 app.get("/getStudents",function(req,res){
    let page = +req.query.page;
    let course = req.query.course;
    let arr = course?course.split(","):[];
   //  console.log(arr)
    let items = [];
    let data = arr.length>0?
                 students.filter((ele)=>arr.findIndex((ar)=> ele.courses.findIndex((st)=> st===ar)>=0)>=0)
                  :
                  students;
    let totalNum = data.length;
    let numberOfPage = 3;
    let start = ((page-1)*numberOfPage);
    let end = ((page*numberOfPage)-1)>totalNum?totalNum-1:(page*numberOfPage)-1;
    items = data.filter((ele,index)=> index>=start && index<=end);
    let ar = {}
    ar.page = page;
    ar.items = items
    ar.totalItems = items.length
    ar.totalNum = totalNum
    res.send(ar);
 });

 app.get("/getFaculties",function(req,res){
   let page = +req.query.page;
   let course = req.query.course;
   let arr = course?course.split(","):[];
   let items = [];
   let data = arr.length>0?
                faculties.filter((ele)=>arr.findIndex((ar)=> ele.courses.findIndex((st)=> st===ar)>=0)>=0)
                 :
                 faculties;
   let totalNum = data.length;
   let numberOfPage = 3;
   let start = ((page-1)*numberOfPage);
   let end = ((page*numberOfPage)-1)>totalNum?totalNum-1:(page*numberOfPage)-1;
   items = data.filter((ele,index)=> index>=start && index<=end);
   let ar = {}
   ar.page = page;
   ar.items = items
   ar.totalItems = items.length;
   ar.totalNum = totalNum
   res.send(ar);
});

app.get("/getStudentCourse/:name",function(req,res){
   let name = req.params.name;
   let arr = students.find((ele)=> ele.name===name);
   let course = arr.courses;
   console.log(course)
   let ar = courses.filter((ele)=> course.findIndex((st)=> st === ele.name)>=0);
   res.send(ar);
});

app.get("/getStudentClass/:name",function(req,res){
   let name = req.params.name;
   let arr = students.find((ele)=> ele.name===name);
   let course = arr.courses;
   console.log(course)
   let ar = classes.filter((ele)=> course.findIndex((st)=> st === ele.course)>=0);
   res.send(ar);
});

app.get("/getStudentDetails/:name",function(req,res){
   let name = req.params.name;
   let str = students.find((ele)=> ele.name === name)
   res.send(str);
});

app.get('/getFacultyCourse/:name',function(req,res){
   let name = req.params.name;
   let str = faculties.find((ele)=> ele.name === name);
   let course = str.courses;
   let st = courses.filter((ele)=> course.findIndex((st)=> st === ele.name)>=0);
   res.send(st);
});

app.get("/getFacultyClass/:name",function(req,res){
   let name = req.params.name;
   let str = faculties.find((ele)=> ele.name === name);
   let course = str.courses;
   let st = classes.filter((ele)=> course.findIndex((st)=> st===ele.course)>=0);
   res.send(st);
});

app.get("/getClassesById/:id",function(req,res){
   let id = req.params.id;
   console.log(id)
   let str = classes.find((ele)=> +ele.classId === +id);
   console.log(str);
   res.send(str);
});

app.put("/putCourse",function(req,res){
   let id = req.body.courseId;
   let student = req.body.students;
   let courseName = req.body.name;
   let fac = req.body.faculty;
   console.log(req.body);
   let index = courses.findIndex((ele)=> ele.courseId===id)
   if(index>=0){
      courses[index] = req.body;
   }
   for(let i=0;i<student.length;i++){
      console.log(student[i]);
      let index1 = students.findIndex((ele)=> ele.name === student[i]);
      console.log(index1);
      if(index1>=0){
         let index2 = students[index1].courses.findIndex((ele)=> ele===courseName);
         console.log(index2);
         if(index2===-1){
            students[index1].courses.unshift(courseName);
         }
      }
   }

   for(let i=0;i<fac.length;i++){
      let index1 = faculties.findIndex((ele)=> ele.name === fac[i]);
      if(index1>=0){
         let index2 = faculties[index1].courses.findIndex((ele)=> ele===courseName);
         console.log(index2);
         if(index2===-1){
            faculties[index1].courses.unshift(courseName);
         }
      }
   }
   res.send(req.body);
 });

 app.post("/postStudentDetails",function(req,res){
   let name = req.body.name;
   let index = students.findIndex((ele)=> ele.name===name);
   students[index].gender = req.body.gender;
   students[index].dob = req.body.dob;
   students[index].about = req.body.about?req.body.about:"";
   res.send(students[index]);
 });

 app.post("/postClass",function(req,res){
   let ar = {};
      ar.course= req.body.course;
      ar.time= req.body.time;
      ar.endTime= req.body.endTime;
      ar.topic= req.body.topic;
      ar.facultyName= req.body.facultyName;
      let maxId = classes.reduce((acc,cur)=> acc>cur.classId?acc:cur.classId);
      ar.classId = maxId+1;
      classes.unshift(ar);
      console.log(ar);
      res.send(ar);
 });

 app.put("/postClass/:id",function(req,res){
   let id = req.params.id;
   let index = classes.findIndex((ele)=> +ele.classId===+id);
   classes[index] = req.body;
   res.send(req.body);
 })

