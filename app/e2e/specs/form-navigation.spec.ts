import { test, expect } from '../fixtures/test.fixture';
import { formData } from '../data/test-data';
import { DOCUMENTS } from '../data/constants';

test.describe('Form Navigation - Flujo de wizard y leader', () => {
  test('create mode: isLeader=No → modal de éxito sin navegar a step 2', async ({ searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.NEW_CC);
    await formPage.step1Indicator.waitFor({ state: 'visible' });

    await formPage.fillBasicInfo({
      names: formData.names,
      lastNames: formData.lastNames,
      email: formData.email,
      phone: formData.phone,
      identificationType: formData.identificationType,
      identification: DOCUMENTS.NEW_CC,
    });
    await formPage.fillPersonalInfo({
      nationality: formData.nationality,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      address: formData.address,
      neighborhood: formData.neighborhood,
      municipality: formData.municipality,
      network: formData.network,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
    });
    await formPage.setRadio(/¿Ha asistido a Encuentro\?/i, 'Sí');
    await formPage.fillChurchInfo({
      ministry: formData.ministry,
      yearArrivedAtChurch: formData.yearArrivedAtChurch,
      formationLevel: formData.formationLevel,
    });

    await formPage.setRadio(/¿Es líder\?/i, 'No');
    await formPage.fillYearInput(/año en el que llegaste/i, formData.yearArrivedAtChurch);

    await formPage.submitStep1();

    const hasModal = await formPage.hasSuccessModal();
    expect(hasModal).toBe(true);

    const step2Visible = await formPage.isStep2Visible();
    expect(step2Visible).toBe(false);
  });

  test('create mode: isLeader=Sí navega a step 2', async ({ searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.NEW_CC);
    await formPage.step1Indicator.waitFor({ state: 'visible' });

    await formPage.fillBasicInfo({
      names: formData.names,
      lastNames: formData.lastNames,
      email: formData.email,
      phone: formData.phone,
      identificationType: formData.identificationType,
      identification: DOCUMENTS.NEW_CC,
    });
    await formPage.fillPersonalInfo({
      nationality: formData.nationality,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      address: formData.address,
      neighborhood: formData.neighborhood,
      municipality: formData.municipality,
      network: formData.network,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
    });
    await formPage.setRadio(/¿Ha asistido a Encuentro\?/i, 'Sí');
    await formPage.fillChurchInfo({
      ministry: formData.ministry,
      yearArrivedAtChurch: formData.yearArrivedAtChurch,
      formationLevel: formData.formationLevel,
    });

    await formPage.setRadio(/¿Es líder\?/i, 'Sí');
    await formPage.fillYearInput(/año en el que llegaste/i, formData.yearArrivedAtChurch);

    await formPage.submitStep1();

    const step2Visible = await formPage.isStep2Visible();
    expect(step2Visible).toBe(true);
  });

  test('update mode: isLeader=Sí navega a step 2', async ({ searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.EXISTING_CC);

    const updateVisible = await searchPage.isUpdateMode();
    expect(updateVisible).toBe(true);
    await formPage.step1Indicator.waitFor({ state: 'visible' });

    await formPage.setRadio(/¿Es líder\?/i, 'Sí');

    await formPage.submitStep1();

    const step2Visible = await formPage.isStep2Visible();
    expect(step2Visible).toBe(true);
  });

  test('update mode: isLeader=No → modal de éxito sin navegar a step 2', async ({ searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.EXISTING_CC);

    const updateVisible = await searchPage.isUpdateMode();
    expect(updateVisible).toBe(true);
    await formPage.step1Indicator.waitFor({ state: 'visible' });

    await formPage.setRadio(/¿Es líder\?/i, 'No');
    await formPage.submitStep1();

    const step2Visible = await formPage.isStep2Visible();
    expect(step2Visible).toBe(false);

    const hasModal = await formPage.hasSuccessModal();
    expect(hasModal).toBe(true);
  });
});
