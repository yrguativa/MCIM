import { test, expect } from '../fixtures/test.fixture';
import { DOCUMENTS } from '../data/constants';

test.describe('Children - CRUD y creación de discípulo', () => {
  test.beforeEach(async ({ searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.NEW_CC);
    await formPage.step1Indicator.waitFor({ state: 'visible' });

    await formPage.namesInput.fill('Test');
    await formPage.lastNamesInput.fill('User');
    await formPage.phoneInput.fill('3001234567');
    await formPage.identificationInput.fill(DOCUMENTS.NEW_CC);
  });

  test('crear nuevo discípulo desde modal de hijo y se muestra en tabla', async ({ formPage }) => {
    await formPage.setRadio(/¿Tiene hijos\?/i, 'Sí');
    await formPage.page.getByRole('button', { name: /Agregar hijo/i }).click();
    await expect(formPage.page.getByRole('dialog').first()).toBeVisible();

    await formPage.setRadio(/¿asiste a una célula/i, 'Sí');
    await formPage.page.getByRole('tab', { name: /Crear/i }).click();

    const childId = `999${Math.floor(Math.random() * 9000000)}`;
    await formPage.page.getByLabel(/Número de Identificación/i).fill(childId);
    await formPage.page.getByLabel(/^Nombres/i).first().fill('Hijito');
    await formPage.page.getByLabel(/Apellidos/i).fill('Test');
    await formPage.page.getByRole('button', { name: /Guardar y Agregar/i }).click();

    await expect(formPage.page.getByRole('cell', { name: /Hijito Test/i })).toBeVisible({ timeout: 5000 });
  });

  test('agregar hijo que no asiste con nombre y edad', async ({ formPage }) => {
    await formPage.setRadio(/¿Tiene hijos\?/i, 'Sí');
    await formPage.page.getByRole('button', { name: /Agregar hijo/i }).click();
    await expect(formPage.page.getByRole('dialog').first()).toBeVisible();

    await formPage.setRadio(/¿asiste a una célula/i, 'No');
    await formPage.page.getByLabel(/^Nombre/i).first().fill('Hijo No Asiste');
    await formPage.page.getByLabel(/Edad/i).first().fill('7');
    await formPage.page.getByRole('button', { name: /Guardar/i }).first().click();

    await expect(formPage.page.getByRole('cell', { name: 'Hijo No Asiste' })).toBeVisible();
    await expect(formPage.page.getByRole('cell', { name: '7' })).toBeVisible();
  });
});
