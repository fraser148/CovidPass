import controller from '../controllers/user.controller'

const UserRoutes = (app) => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/employee/create/", controller.createEmployee);
  app.post("/employee/result/", controller.recordTest);

  app.get("/company/reference/:ref", controller.checkCompany)
  app.get("/company/stats", controller.getStats)
  app.get("/company/employees", controller.getEmployees)
  app.get("/company/groups", controller.getGroups)
  app.get("/company/group/:group", controller.getGroup)
};

export default UserRoutes;