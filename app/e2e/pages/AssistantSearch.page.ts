import type { Page, Locator } from '@playwright/test';
import { ROUTES, LABELS } from '../data/constants';

export class AssistantSearchPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly documentInput: Locator;
  readonly checkbox: Locator;
  readonly searchButton: Locator;
  readonly newSearchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: LABELS.searchTitle });
    this.documentInput = page.getByPlaceholder('Ingrese su número de documento');
    this.checkbox = page.getByRole('checkbox', { name: /política de protección de datos/i });
    this.searchButton = page.getByRole('button', { name: 'Buscar' });
    this.newSearchButton = page.getByRole('button', { name: 'Nueva búsqueda' });
  }

  async dismissLanguageDialog() {
    const keepSpanish = this.page.getByRole('button', { name: /keep spanish/i });
    if (await keepSpanish.isVisible({ timeout: 2000 }).catch(() => false)) {
      await keepSpanish.click();
      await this.page.waitForTimeout(300);
    }
  }

  async goto() {
    await this.page.goto(ROUTES.INITIAL_INFORMATION);
    await this.page.waitForLoadState('domcontentloaded');
    await this.dismissLanguageDialog();
  }

  async search(document: string) {
    await this.checkbox.click({ force: true });
    await this.documentInput.fill(document);
    await this.searchButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isUpdateMode(): Promise<boolean> {
    try {
      await this.page.getByText(LABELS.updateTitle).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
