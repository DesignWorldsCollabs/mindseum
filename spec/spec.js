beforeEach(function(){
  browser.ignoreSynchronization = true;
});

describe('Mindseum', function() {
  describe('Home', function () {
    beforeEach(function(){
      getPath('/explore/default-board');
    });

    it('should have a title', function() {
      expect(browser.getTitle()).toEqual('Mindseum');
    });
  });
});

function getPath(path) {
  browser.get('http://localhost:3000' + path);
}
