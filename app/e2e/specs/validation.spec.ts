import { test, expect } from '../fixtures/test.fixture';
import { DOCUMENTS } from '../data/constants';

test.describe('Validation - Mensajes de error y restricciones', () => {
  test('campos obligatorios muestran error al enviar vacíos', async ({ page, searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.NEW_CC);
    await formPage.step1Indicator.waitFor({ state: 'visible' });

    await formPage.submitStep1();

    const errorMessages = page.getByText(/obligatorio|requerido/i);
    const count = await errorMessages.count();
    expect(count).toBeGreaterThan(0);
  });

  test('número de documento muy corto muestra error', async ({ page, searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.NEW_CC);
    await formPage.step1Indicator.waitFor({ state: 'visible' });

    await formPage.namesInput.fill('Test');
    await formPage.lastNamesInput.fill('User');
    await formPage.phoneInput.fill('3001234567');
    await formPage.identificationInput.fill('12');

    await formPage.submitStep1();
    const error = page.getByText(/mínimo/i).or(page.getByText(/corto/i));
    await expect(error).toBeVisible();
  });

  test('email inválido muestra error', async ({ page, searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.NEW_CC);
    await formPage.step1Indicator.waitFor({ state: 'visible' });

    await formPage.namesInput.fill('Test');
    await formPage.lastNamesInput.fill('User');
    await formPage.emailInput.fill('invalido');
    await formPage.phoneInput.fill('3001234567');

    await formPage.submitStep1();
    const error = page.getByText(/email|correo/i);
    await expect(error).toBeVisible();
  });

  test('teléfono no numérico muestra error', async ({ page, searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.NEW_CC);
    await formPage.step1Indicator.waitFor({ state: 'visible' });

    await formPage.namesInput.fill('Test');
    await formPage.lastNamesInput.fill('User');
    await formPage.phoneInput.fill('abcdefg');

    await formPage.submitStep1();
    const error = page.getByText(/número|numérico|digito/i);
    await expect(error).toBeVisible();
  });

  test('fecha de nacimiento futura no debe poder seleccionarse', async ({ page, formPage }) => {
    test.slow();

    await formPage.birthDateButton.click();
    const yearSelect = page.getByRole('combobox', { name: 'Year' });
    await yearSelect.fill('3000');
    await expect(page.getByRole('option', { selected: true })).not.toContainText('3000');
  });
});
