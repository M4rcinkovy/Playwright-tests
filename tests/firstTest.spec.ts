import {test, expect} from '@playwright/test'

test.beforeEach (async({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async({page}) => {
    //Tag name
    await page.locator('input').first().click()

    //ID
    await page.locator('#inputEmail1 ').click()

    //Class
    page.locator('.shape-rectangle')

    //Attribute
    page.locator('[placeholder="Email"]')

    //Class value (full)
    page.locator('class="input-full-width size-medium status-basic shape-rectangle nb-transition"')

    //combine different selectors
    page.locator('input[placeholder="Email"].shape-rectangle')
    page.locator('input[placeholder="Email"].[nbinput]') // dwa atrybuty

    //by XPath (not recommended)
    page.locator('//*[@id="inputEmail1"]')

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()
    
    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()
    
    await page.getByTestId('SignIn').click()
    
    await page.getByTitle('IoT Dashboard').click()
    
})

test.only('Locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click() //try not use first(), last() 
    //await page.locator('nb-card nb-radio :text-is("Option 1")' ).first().click() // tez to jesr dobrze 
    //getByRole - userface locator
    //locator - normal locator
    await page.locator('nb-card').nth(3).getByRole('button').click() // try to avoid this approach; nth -> index of the element on the page
})

test('Locating parent locator', async ({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).first().click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).first().click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).first().click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).first().click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).first().click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).first().click()
})

test('Reusing Locators', async ({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})

test('extracting values', async({page}) => {
    //single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
    const RadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(RadioButtonsLabels).toContain("Option 1")

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('assertion', async({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    //General assertion
    const value = 5
    expect(value).toEqual(6)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //Locator assertion
    expect(basicFormButton).toHaveText('Submit')

    //Soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit') // nor a really good practise - jesli asercja zawiedzie, dalej mozemy wykonywac swoj test, a nie przerywa sie 
    await basicFormButton.click()
})

test('auto-waiting', async({page}) => {

})

/* test('the first test', async({page}) => {
    await page.getByText('Form Layouts').click()
})

test('navigate the datepicker page', async({page}) => {
    await page.getByText('Datepicker').click()
}) */