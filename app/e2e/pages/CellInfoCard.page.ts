import type { Page, Locator } from '@playwright/test';
import { LABELS } from '../data/constants';

export class CellInfoCardPage {
  readonly page: Page;
  readonly step2Heading: Locator;
  readonly addCellButton: Locator;
  readonly saveButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.step2Heading = page.getByRole('heading', { name: LABELS.step2 });
    this.addCellButton = page.getByRole('button', { name: LABELS.addCell });
    this.saveButton = page.getByRole('button', { name: LABELS.save });
    this.backButton = page.getByRole('button', { name: LABELS.back });
  }

  cellContainer(index: number) {
    return this.page.getByRole('heading', { name: `Información de la Célula ${index + 1}` }).locator('..').locator('..');
  }

  async selectCellType(cellIndex: number, cellType: string) {
    const container = this.cellContainer(cellIndex);
    const select = container.getByRole('combobox').first();
    await select.click();
    await this.page.getByRole('option', { name: cellType }).click();
  }

  async fillCellBasicInfo(
    cellIndex: number,
    data: { day: string; time: string; address: string; neighborhood: string; yearOpened: string }
  ) {
    const container = this.cellContainer(cellIndex);

    const daySelect = container.getByRole('combobox', { name: /día/i });
    await daySelect.click();
    await this.page.getByRole('option', { name: data.day }).click();

    const hourInput = container.getByRole('spinbutton', { name: /hours/i });
    await hourInput.click();
    await hourInput.fill(data.time.split(':')[0]);
    const minuteInput = container.getByRole('spinbutton', { name: /minutes/i });
    await minuteInput.click();
    await minuteInput.fill(data.time.split(':')[1]);

    const addressInput = container.getByRole('textbox').first();
    await addressInput.fill(data.address);

    const yearSelect = container.getByRole('combobox', { name: /año de apertura/i });
    await yearSelect.click();
    await this.page.getByRole('option', { name: data.yearOpened }).click();
  }

  async selectNeighborhood(cellIndex: number, neighborhood: string) {
    const container = this.cellContainer(cellIndex);
    const neighborhoodBtn = container.getByRole('combobox', { name: /barrio/i });
    await neighborhoodBtn.click();
    await this.page.getByRole('option', { name: neighborhood }).click();
  }

  async selectHost(cellIndex: number, hostName: string) {
    const container = this.cellContainer(cellIndex);
    const hostTrigger = container.getByRole('combobox', { name: /anfitrión/i });
    await hostTrigger.click();
    const searchInput = this.page.getByRole('combobox', { name: /buscar/i });
    await searchInput.fill(hostName);
    await this.page.getByRole('option', { name: new RegExp(hostName, 'i') }).first().click();
  }

  async selectTimoteo(cellIndex: number, timoteoName: string) {
    const container = this.cellContainer(cellIndex);
    const timoteoTrigger = container.getByRole('combobox', { name: /timoteo/i });
    await timoteoTrigger.click();
    const searchInput = this.page.getByRole('combobox', { name: /buscar/i });
    await searchInput.fill(timoteoName);
    await this.page.getByRole('option', { name: new RegExp(timoteoName, 'i') }).first().click();
  }

  async openAddAssistantModal(cellIndex: number) {
    const container = this.cellContainer(cellIndex);
    await container.getByRole('button', { name: LABELS.addAssistant }).click();
  }

  async addNewAssistant(name: string, lastName: string, identification: string) {
    await this.page.getByRole('tab', { name: 'Nuevo' }).click();
    await this.page.getByRole('textbox', { name: /identificación/i }).fill(identification);
    await this.page.getByRole('textbox', { name: /^Nombres/i }).fill(name);
    await this.page.getByRole('textbox', { name: /Apellidos/i }).fill(lastName);
    await this.page.getByRole('button', { name: 'Guardar y Agregar' }).click();
  }

  async addExistingAssistant(searchQuery: string) {
    await this.page.getByRole('tab', { name: 'Buscar' }).click();
    const searchInput = this.page.getByRole('combobox', { name: /buscar/i });
    await searchInput.fill(searchQuery);
    await this.page.getByRole('option', { name: new RegExp(searchQuery, 'i') }).first().click();
  }

  async removeAssistant(cellIndex: number, assistantName: string) {
    const container = this.cellContainer(cellIndex);
    const row = container.getByRole('row').filter({ hasText: assistantName });
    await row.getByRole('button').click();
  }

  async getAssistantNames(cellIndex: number): Promise<string[]> {
    const container = this.cellContainer(cellIndex);
    const rows = container.getByRole('row');
    const names: string[] = [];
    const count = await rows.count();
    for (let i = 1; i < count; i++) {
      const text = await rows.nth(i).innerText();
      names.push(text);
    }
    return names;
  }

  async isHostTimoteoVisible(cellIndex: number): Promise<boolean> {
    const container = this.cellContainer(cellIndex);
    try {
      await container.getByText(LABELS.host).waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async submit() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
