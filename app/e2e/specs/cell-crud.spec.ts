import { test, expect } from '../fixtures/test.fixture';
import { DOCUMENTS } from '../data/constants';

test.describe('Cell CRUD - Paso 2 (Información de Célula)', () => {
  test.beforeEach(async ({ searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.NEW_CC);
    await formPage.step1Indicator.waitFor({ state: 'visible' });
  });

  test('tipo Célula mustra campos Anfitrión y Timoteo', async ({ formPage, cellPage }) => {
    await formPage.setRadio(/¿Es líder\?/i, 'Sí');
    await formPage.fillYearInput(/año en el que llegaste/i, '2018');
    await formPage.submitStep1();

    const step2Visible = await formPage.isStep2Visible();
    expect(step2Visible).toBe(true);

    await cellPage.selectCellType(0, 'Célula');

    const hostVisible = await cellPage.isHostTimoteoVisible(0);
    expect(hostVisible).toBe(true);
  });

  test('tipo Discipulado oculta campos Anfitrión y Timoteo', async ({ formPage, cellPage }) => {
    await formPage.setRadio(/¿Es líder\?/i, 'Sí');
    await formPage.fillYearInput(/año en el que llegaste/i, '2018');
    await formPage.submitStep1();

    const step2Visible = await formPage.isStep2Visible();
    expect(step2Visible).toBe(true);

    await cellPage.selectCellType(0, 'Discipulado');

    const hostVisible = await cellPage.isHostTimoteoVisible(0);
    expect(hostVisible).toBe(false);
  });

  test('agregar asistente existente a célula', async ({ formPage, cellPage }) => {
    await formPage.setRadio(/¿Es líder\?/i, 'Sí');
    await formPage.fillYearInput(/año en el que llegaste/i, '2018');
    await formPage.submitStep1();

    const step2Visible = await formPage.isStep2Visible();
    expect(step2Visible).toBe(true);

    await cellPage.selectCellType(0, 'Célula');
    await cellPage.openAddAssistantModal(0);
    await cellPage.addExistingAssistant('Juan');

    const names = await cellPage.getAssistantNames(0);
    expect(names.length).toBeGreaterThan(0);
  });

  test('agregar y remover asistente de célula', async ({ formPage, cellPage }) => {
    await formPage.setRadio(/¿Es líder\?/i, 'Sí');
    await formPage.fillYearInput(/año en el que llegaste/i, '2018');
    await formPage.submitStep1();

    const step2Visible = await formPage.isStep2Visible();
    expect(step2Visible).toBe(true);

    await cellPage.selectCellType(0, 'Célula');

    await cellPage.openAddAssistantModal(0);
    await cellPage.addExistingAssistant('María');

    let names = await cellPage.getAssistantNames(0);
    const beforeCount = names.length;

    await cellPage.removeAssistant(0, 'María');
    names = await cellPage.getAssistantNames(0);
    expect(names.length).toBe(beforeCount - 1);
  });

  test('agregar asistente nuevo desde el modal', async ({ formPage, cellPage }) => {
    await formPage.setRadio(/¿Es líder\?/i, 'Sí');
    await formPage.fillYearInput(/año en el que llegaste/i, '2018');
    await formPage.submitStep1();

    const step2Visible = await formPage.isStep2Visible();
    expect(step2Visible).toBe(true);

    await cellPage.selectCellType(0, 'Célula');
    await cellPage.openAddAssistantModal(0);
    await cellPage.addNewAssistant('Pedro', 'Gómez', '1112233445');

    const names = await cellPage.getAssistantNames(0);
    expect(names.some(n => n.includes('Gómez'))).toBe(true);
  });
});
