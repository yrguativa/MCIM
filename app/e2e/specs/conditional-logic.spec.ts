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

  test('Modal de agregar hijo - muestra tabs Buscar/Crear cuando asiste a célula', async ({ formPage }) => {
    await formPage.setRadio(/¿Tiene hijos\?/i, 'Sí');
    await formPage.page.getByRole('button', { name: /Agregar hijo/i }).click();

    await expect(formPage.page.getByRole('dialog').or(formPage.page.getByRole('heading', { name: /agregar/i })).first()).toBeVisible();

    await formPage.setRadio(/¿asiste a una célula/i, 'Sí');
    await expect(formPage.page.getByRole('tab', { name: /Buscar/i })).toBeVisible();
    await expect(formPage.page.getByRole('tab', { name: /Crear/i })).toBeVisible();
  });

  test('Modal de agregar hijo - pestaña Crear tiene campos de identificación', async ({ formPage }) => {
    await formPage.setRadio(/¿Tiene hijos\?/i, 'Sí');
    await formPage.page.getByRole('button', { name: /Agregar hijo/i }).click();

    await formPage.setRadio(/¿asiste a una célula/i, 'Sí');
    await formPage.page.getByRole('tab', { name: /Crear/i }).click();

    await expect(formPage.page.getByLabel(/Número de Identificación/i)).toBeVisible();
    await expect(formPage.page.getByLabel(/^Nombres/i).first()).toBeVisible();
    await expect(formPage.page.getByLabel(/Apellidos/i)).toBeVisible();
    await expect(formPage.page.getByRole('button', { name: /Guardar y Agregar/i })).toBeVisible();
  });

  test('Modal de agregar hijo - campos nombre/edad cuando no asiste', async ({ formPage }) => {
    await formPage.setRadio(/¿Tiene hijos\?/i, 'Sí');
    await formPage.page.getByRole('button', { name: /Agregar hijo/i }).click();

    await formPage.setRadio(/¿asiste a una célula/i, 'No');
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

  test('attendedEncounter=Sí muestra año, repite, reencuentro, bautizo, líder, 144 y escuela', async ({ formPage }) => {
    await formPage.setRadio(/¿Ha asistido a Encuentro\?/i, 'Sí');
    await expect(formPage.page.getByLabel(/¿Qué año asistió\?/i).first()).toBeVisible();
    await expect(formPage.page.getByText(/repetido encuentro/i)).toBeVisible();
    await expect(formPage.page.getByText(/Reencuentro/i)).toBeVisible();
    await expect(formPage.page.getByText(/bautizado/i)).toBeVisible();
    await expect(formPage.page.getByText(/¿Es líder\?/i)).toBeVisible();
    await expect(formPage.page.getByText(/144 mil/i)).toBeVisible();
    await expect(formPage.page.getByText(/Nivel de escuela/i)).toBeVisible();

    await formPage.setRadio(/¿Ha asistido a Encuentro\?/i, 'No');
    await expect(formPage.page.getByLabel(/¿Qué año asistió\?/i).first()).not.toBeVisible();
    await expect(formPage.page.getByText(/repetido encuentro/i)).not.toBeVisible();
    await expect(formPage.page.getByText(/Reencuentro/i)).not.toBeVisible();
    await expect(formPage.page.getByText(/bautizado/i)).not.toBeVisible();
    await expect(formPage.page.getByText(/¿Es líder\?/i)).not.toBeVisible();
    await expect(formPage.page.getByText(/144 mil/i)).not.toBeVisible();
    await expect(formPage.page.getByText(/Nivel de escuela/i)).not.toBeVisible();
  });

  test('attendedEncounter=No asigna valores por defecto al enviar', async ({ searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.NEW_CC);
    await formPage.step1Indicator.waitFor({ state: 'visible' });

    await formPage.namesInput.fill('Test');
    await formPage.lastNamesInput.fill('User');
    await formPage.phoneInput.fill('3001234567');
    await formPage.identificationInput.fill(DOCUMENTS.NEW_CC);

    await formPage.fillPersonalInfo({
      nationality: 'Colombiana',
      gender: 'Masculino',
      address: 'Cra 8 # 15-30',
      neighborhood: 'CENTRO MOSQUERA',
      municipality: 'Mosquera',
      network: 'Jóvenes',
    });
    await formPage.selectBirthDate('15', '4', '1995');
    await formPage.setRadio(/¿Ha asistido a Encuentro\?/i, 'No');

    await formPage.ministrySelect.click();
    await formPage.page.getByRole('option', { name: 'Ps. Arvey & Jeimy' }).click();
    await formPage.yearArrivedInput.fill('2022');

    await formPage.submitStep1();
    await expect(formPage.page.getByText(/guardada/i)).toBeVisible({ timeout: 10000 });
  });

  test('attendedEncounter=YES → reencuentro=Sí muestra año, No lo oculta', async ({ formPage }) => {
    await formPage.setRadio(/¿Ha asistido a Encuentro\?/i, 'Sí');
    await formPage.setRadio(/¿Ha asistido a Reencuentro\?/i, 'Sí');
    await expect(formPage.page.getByLabel(/¿Qué año asistió\?/i).last()).toBeVisible();

    await formPage.setRadio(/¿Ha asistido a Reencuentro\?/i, 'No');
    await expect(formPage.page.getByLabel(/¿Qué año asistió\?/i).last()).not.toBeVisible();
  });
});
