//supertest used to send http queries

const request = require('supertest');

const app = require('../app');

const customerRouter = require('../routes/customerRouter');

const entryRouter =require("../routes/entryRouter");

const statusControllor = require('../controllers/statusController');

const orderControllor = require('../controllers/orderController');

const Status = require('../models/status');

const supertest = require('supertest');

jest.setTimeout(10000);
describe('Test suite: integration-vendors', () => {
  test('Test 1:check that initial entry router works',  async function(){
    const res = await supertest(app)
    .get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Snacks in a Van")
  });

  let agent = request.agent(app);
  let cookie = null;
  beforeAll(() => agent
  .post('/vendor')
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .send({
    vendorName:"Tash's Tuckshop",
    password: "password",
  })
  .then((res) =>{
    cookie=res
    .headers['set-cookie'][0]
    .split(',')
    .map(item => item.split(';')[0])
    .join(';')
  }));


  test('Test 2: vendor is authenticated and reaches vendorMapHome', () =>{
    return agent
    .get('/vendor/setLocation')
    .set('Cookie', cookie)
    .then((response)=> {
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('<div id="mapid"></div>');
    });
  });

  test('Test 3: vendor can use post request on map page', () =>{
    return agent
    .get('/vendor/setLocation')
    .set('Cookie', cookie)
    .send('6080f16dc6055a9fc72ff0b3',
           {locationDescription:"test"}, {new:true},{isAuthenticated: jest.fn().mockResolvedValue(true)})
    .then((response)=> {
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('<div id="mapid">');
    });
  });

  test('Test 4: post request is recieved and vendor is redirected to current orders page with updated status', () =>{
    return agent
    .post('/vendor/status/updateLocationDescription')
    .set('Cookie', cookie)
    .send('6080f16dc6055a9fc72ff0b3',
           {locationDescription:"test"}, {new:true},{isAuthenticated: jest.fn().mockResolvedValue(true)})
    .then((response)=> {
      //redirect
      expect(response.statusCode).toBe(302);
      expect(response.text).toContain('login');
   });
  });

  test('Test 5: post request is recieved and vendor is redirected to current orders page with updated', () =>{
    return agent
    .set('Cookie', cookie)
    .get('/vendor/order/unfulfilled')
    .send({isAuthenticated: jest.fn().mockResolvedValue(true)})
    .then((response)=> {
      //redirected
      expect(response.statusCode).toBe(302);
      expect(response.text).toContain('vendor');
    });
  });

});


describe("UPDATE vendor tests using spy", () => {

  it("Should update a vendor successfully!", () => {
    const mockUser = {
      vendorId: '6080f16dc6055a9fc72ff0b3',
      locationDescription: "test desc 1",
      readyForOrders: false,
      vendorName: "test vendor"
    };
    const mockResponseUser = {
      vendorId: '6080f16dc6055a9fc72ff0b3',
      locationDescription: 'has updated-test desc 1',
      readyForOrders: true,
      vendorName: "test vendor"
    }
    const spy = jest.spyOn(statusControllor, "updateLocationDescription").mockReturnValueOnce(mockResponseUser);
    statusControllor.updateLocationDescription(mockUser.vendorId,
      {
      locationDescription: 'has updated-test desc 1',
      readyForOrders:true
      },
     {
        new: true,
      },
      {isAuthenticated: jest.fn().mockReturnValue('True')}
      );

    const spyUpdatedUser = spy.mock.results[0].value;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyUpdatedUser.locationDescription).toEqual('has updated-test desc 1');
    expect(spyUpdatedUser.readyForOrders).toEqual(true);

    spy.mockReset();
  });

  it("Should returns an error if a user does not exist", () => {
    const spy = jest.spyOn(statusControllor, "updateLocationDescription").mockReturnValueOnce("Id provided does not match any vendor");
    statusControllor.updateLocationDescription('1234', {
      locationDescription: "test desc 1",
    }, {
      new: true,
    },
    {isAuthenticated: jest.fn().mockReturnValue('True')}
    );

    const spyUpdatedUser = spy.mock.results[0].value;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyUpdatedUser).toEqual("Id provided does not match any vendor");
    spy.mockReset();
  });
});
