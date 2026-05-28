import { test, expect } from '../fixtures/test.fixture';
import { DOCUMENTS } from '../data/constants';

test.describe('Conditional Logic - Secciones dinámicas', () => {
  test.beforeEach(async ({ searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.NEW_CC);
    await formPage.step1Indicator.waitFor({ state: 'visible' });
  });

  test('hasChildren=Sí muestra sección Hijos, No la oculta', async ({ formPage }) => {
    const childrenSection = formPage.page.getByText('Hijos').first();

    await formPage.setRadio(/¿Tiene hijos\?/i, 'Sí');
    await expect(childrenSection).toBeVisible();
    await expect(formPage.page.getByRole('button', { name: /Agregar hijo/i })).toBeVisible();

    await formPage.setRadio(/¿Tiene hijos\?/i, 'No');
    await expect(childrenSection).not.toBeVisible();
  });

  test('Modal de agregar hijo - muestra buscador cuando asiste a la iglesia', async ({ formPage }) => {
    await formPage.setRadio(/¿Tiene hijos\?/i, 'Sí');
    await formPage.page.getByRole('button', { name: /Agregar hijo/i }).click();

    await expect(formPage.page.getByRole('dialog').or(formPage.page.getByRole('heading', { name: /agregar/i })).first()).toBeVisible();

    await formPage.setRadio(/¿Asiste a la iglesia\?/i, 'Sí');
    await expect(formPage.page.getByPlaceholder(/buscar/i).first()).toBeVisible();
  });

  test('Modal de agregar hijo - campos nombre/edad cuando no asiste', async ({ formPage }) => {
    await formPage.setRadio(/¿Tiene hijos\?/i, 'Sí');
    await formPage.page.getByRole('button', { name: /Agregar hijo/i }).click();

    await formPage.setRadio(/¿Asiste a la iglesia\?/i, 'No');
    await expect(formPage.page.getByLabel(/^Nombre/i).first()).toBeVisible();
    await expect(formPage.page.getByLabel(/Edad/i).first()).toBeVisible();
  });

  test('maritalStatus=Casado muestra sección cónyuge, Soltero la oculta', async ({ formPage }) => {
    const spouseSection = formPage.page.getByText('Información del Cónyuge').first();

    await formPage.maritalStatusSelect.click();
    await formPage.page.getByRole('option', { name: 'Casado(a)' }).click();
    await expect(spouseSection).toBeVisible();

    await formPage.maritalStatusSelect.click();
    await formPage.page.getByRole('option', { name: 'Soltero(a)' }).click();
    await expect(spouseSection).not.toBeVisible();
  });

  test('Cónyuge Sí asiste muestra buscador, No asiste muestra nombre manual', async ({ formPage }) => {
    await formPage.maritalStatusSelect.click();
    await formPage.page.getByRole('option', { name: 'Casado(a)' }).click();

    await formPage.setRadio(/¿Tu cónyuge asiste a la iglesia\?/i, 'Sí');
    const searchTrigger = formPage.page.getByRole('combobox', { name: /cónyuge/i }).or(formPage.page.getByPlaceholder(/buscar/i));
    await expect(searchTrigger.first()).toBeVisible();

    await formPage.setRadio(/¿Tu cónyuge asiste a la iglesia\?/i, 'No');
    await expect(formPage.page.getByLabel(/Nombre del cónyuge/i)).toBeVisible();
  });

  test('otherChurchAttendance=Sí muestra año y sede, No los oculta', async ({ formPage }) => {
    await formPage.setRadio(/¿Asistía a otra sede antes\?/i, 'Sí');
    await expect(formPage.page.getByLabel(/año en que llegaste/i)).toBeVisible();
    await expect(formPage.page.getByText(/¿Cuál sede\?/i)).toBeVisible();

    await formPage.setRadio(/¿Asistía a otra sede antes\?/i, 'No');
    await expect(formPage.page.getByLabel(/año en que llegaste/i)).not.toBeVisible();
  });

  test('attendedEncounter=Sí muestra año y repite, No los oculta', async ({ formPage }) => {
    await formPage.setRadio(/¿Ha asistido a Encuentro\?/i, 'Sí');
    await expect(formPage.page.getByLabel(/¿Qué año asistió\?/i).first()).toBeVisible();
    await expect(formPage.page.getByText(/repetido encuentro/i)).toBeVisible();

    await formPage.setRadio(/¿Ha asistido a Encuentro\?/i, 'No');
    await expect(formPage.page.getByLabel(/¿Qué año asistió\?/i).first()).not.toBeVisible();
  });

  test('attendedReencounter=Sí muestra año, No lo oculta', async ({ formPage }) => {
    await formPage.setRadio(/¿Ha asistido a Reencuentro\?/i, 'Sí');
    await expect(formPage.page.getByLabel(/¿Qué año asistió\?/i).last()).toBeVisible();

    await formPage.setRadio(/¿Ha asistido a Reencuentro\?/i, 'No');
    await expect(formPage.page.getByLabel(/¿Qué año asistió\?/i).last()).not.toBeVisible();
  });
});
