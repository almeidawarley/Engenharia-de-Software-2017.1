describe('the user', function() {
    var email, password, button;
    var EC = protractor.ExpectedConditions;

    beforeEach(function() {
        //É executado antes de todos os casos de teste definidos abaixo
        browser.waitForAngularEnabled(false);
        browser.get('http://localhost:8100/');
    });

    it('should check if it is showing a welcome message', function(){
        //Confere se a tela inicial exibe a mensagem de forma correta
        var welcome = element(by.id('firstMessage')).getText(); 
        expect(welcome).toEqual('Trabalho desenvolvido para a disciplina de Engenharia de Software');
    });

    it('should log in and check information', function() {
        //Confere se o usuário logou e se suas informações foram exibidas corretamente
        email = element(by.css('.loginEmailInput')); 
        password = element(by.css('.loginPasswordInput'));

        email.clear();
        email.sendKeys('w@w.com');
        password.clear();
        password.sendKeys('analuiza');

        button = element(by.id('login_button'));
        button.click();

        browser.wait(EC.visibilityOf(element(by.id('loadedNickname'))), 5000);
        expect(element(by.id('loadedNickname')).getText()).toEqual('Warl');
        browser.wait(EC.visibilityOf(element(by.id('loadedEmail'))), 5000);
        expect(element(by.id('loadedEmail')).getText()).toEqual('w@w.com');

    });

});