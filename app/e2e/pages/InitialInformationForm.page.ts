import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { LABELS } from '../data/constants';

export class InitialInformationFormPage {
  readonly page: Page;
  readonly step1Indicator: Locator;
  readonly step2Indicator: Locator;

  readonly namesInput: Locator;
  readonly lastNamesInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly identificationTypeSelect: Locator;
  readonly identificationInput: Locator;
  readonly nationalitySelect: Locator;
  readonly genderSelect: Locator;
  readonly rhSelect: Locator;
  readonly maritalStatusSelect: Locator;
  readonly municipalitySelect: Locator;
  readonly networkSelect: Locator;
  readonly birthDateButton: Locator;
  readonly ministrySelect: Locator;
  readonly directLeaderSelect: Locator;
  readonly yearArrivedInput: Locator;
  readonly contactNameInput: Locator;
  readonly contactPhoneInput: Locator;
  readonly formationLevelSelect: Locator;

  readonly saveAndContinueButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.step1Indicator = page.getByRole('heading', { name: LABELS.step1 });
    this.step2Indicator = page.getByRole('heading', { name: LABELS.step2 });

    this.namesInput = page.getByLabel(/^Nombres/);
    this.lastNamesInput = page.getByLabel(/^Apellidos/);
    this.emailInput = page.getByLabel(/Correo Electrónico/i);
    this.phoneInput = page.getByLabel(/Celular/);
    this.identificationTypeSelect = page.getByLabel(/Tipo de documento/i);
    this.identificationInput = page.getByLabel(/Número de Documento/i);
    this.nationalitySelect = page.getByLabel(/Nacionalidad/);
    this.genderSelect = page.getByLabel(/Género/);
    this.rhSelect = page.getByLabel(/RH/i);
    this.maritalStatusSelect = page.getByLabel(/Estado civil/i);
    this.municipalitySelect = page.getByLabel(/Municipio/);
    this.networkSelect = page.getByLabel(/Red/);
    this.birthDateButton = page.getByLabel(/Fecha de nacimiento/);
    this.ministrySelect = page.getByLabel(/Ministerio/);
    this.directLeaderSelect = page.getByLabel(/Líder directo/);
    this.yearArrivedInput = page.getByLabel(/año en el que llegaste/i);
    this.contactNameInput = page.getByLabel(/contacto de emergencia/i).first();
    this.contactPhoneInput = page.getByLabel(/Teléfono de contacto/i);
    this.formationLevelSelect = page.getByLabel(/Nivel de escuela/i);

    this.saveAndContinueButton = page.getByRole('button', { name: LABELS.saveAndContinue });
    this.saveButton = page.getByRole('button', { name: LABELS.save });
    this.cancelButton = page.getByRole('button', { name: LABELS.cancel });
    this.backButton = page.getByRole('button', { name: LABELS.back });
  }

  async fillBasicInfo(data: {
    names: string;
    lastNames: string;
    email?: string;
    phone: string;
    identificationType: string;
    identification: string;
  }) {
    await this.namesInput.fill(data.names);
    await this.lastNamesInput.fill(data.lastNames);
    if (data.email) await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.identificationTypeSelect.click();
    await this.page.getByRole('option', { name: data.identificationType }).click();
  }

  async fillAddressViaModal(viaType?: string, mainNumber?: string) {
    const standardizerBtn = this.page.getByRole('button', { name: /estandarizar/i });
    await standardizerBtn.click();

    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.locator('[role="combobox"]').first().click();
    await this.page.getByRole('option', { name: viaType || 'Calle' }).click();

    await dialog.locator('input:not([type="checkbox"])').first().fill(mainNumber || '8');

    await dialog.getByRole('button', { name: /aplicar/i }).click();
    await expect(dialog).not.toBeVisible();
  }

  async selectNeighborhood(neighborhood: string) {
    const trigger = this.page.getByRole('combobox', { name: /barrio/i });
    await trigger.click();
    await this.page.getByPlaceholder('Buscar barrio...').fill(neighborhood);
    await this.page.getByRole('option', { name: neighborhood }).click();
  }

  async fillPersonalInfo(data: {
    nationality: string;
    gender: string;
    rh?: string;
    maritalStatus?: string;
    address: string;
    neighborhood: string;
    municipality: string;
    network: string;
    contactName?: string;
    contactPhone?: string;
  }) {
    await this.nationalitySelect.click();
    await this.page.getByRole('option', { name: data.nationality }).click();
    await this.genderSelect.click();
    await this.page.getByRole('option', { name: data.gender }).click();
    if (data.rh) {
      await this.rhSelect.click();
      await this.page.getByRole('option', { name: data.rh }).click();
    }
    if (data.maritalStatus) {
      await this.maritalStatusSelect.click();
      await this.page.getByRole('option', { name: data.maritalStatus }).click();
    }
    await this.fillAddressViaModal();
    await this.selectNeighborhood(data.neighborhood);
    await this.municipalitySelect.click();
    await this.page.getByRole('option', { name: data.municipality }).click();
    await this.networkSelect.click();
    await this.page.getByRole('option', { name: data.network }).click();
    if (data.contactName) await this.contactNameInput.fill(data.contactName);
    if (data.contactPhone) await this.contactPhoneInput.fill(data.contactPhone);
  }

  async selectBirthDate(day: string, month: string, year: string) {
    await this.birthDateButton.click();
    await this.page.getByRole('combobox', { name: 'Year' }).fill(year);
    await this.page.getByRole('combobox', { name: 'Month' }).selectOption(month);
    await this.page.getByText(day, { exact: true }).click();
  }

  async fillChurchInfo(data: {
    ministry: string;
    directLeader?: string;
    yearArrivedAtChurch: string;
    formationLevel: string;
  }) {
    await this.ministrySelect.click();
    await this.page.getByRole('option', { name: data.ministry }).click();
    if (data.directLeader) {
      await this.directLeaderSelect.click();
      await this.page.getByRole('option', { name: data.directLeader }).click();
    }
    await this.yearArrivedInput.fill(data.yearArrivedAtChurch);
    await this.formationLevelSelect.click();
    await this.page.getByRole('option', { name: data.formationLevel }).click();
  }

  async setRadio(groupLabel: string | RegExp, value: 'Sí' | 'No') {
    const group = this.page.getByText(groupLabel).locator('..');
    await group.getByText(value).click();
  }

  async fillYearInput(label: string | RegExp, year: string) {
    const input = this.page.getByLabel(label);
    await input.fill(year);
  }

  async submitStep1() {
    await this.saveAndContinueButton.click();
    await Promise.race([
      this.page.getByText('¡Información guardada!').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
      this.step2Indicator.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
      this.page.waitForResponse(resp => resp.url().includes('/graphql') && resp.status() === 200, { timeout: 10000 }),
    ]);
  }

  async isStep2Visible(): Promise<boolean> {
    try {
      await this.step2Indicator.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async hasSuccessModal(): Promise<boolean> {
    try {
      await this.page.getByText(LABELS.successTitle).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async dismissSuccessModal() {
    await this.page.getByRole('button', { name: 'Continuar' }).click();
  }
}
