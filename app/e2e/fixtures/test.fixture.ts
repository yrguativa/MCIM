import { test as base } from '@playwright/test';
import { AssistantSearchPage } from '../pages/AssistantSearch.page';
import { InitialInformationFormPage } from '../pages/InitialInformationForm.page';
import { CellInfoCardPage } from '../pages/CellInfoCard.page';
import { DOCUMENTS } from '../data/constants';
import { formData } from '../data/test-data';

export type TestFixtures = {
  searchPage: AssistantSearchPage;
  formPage: InitialInformationFormPage;
  cellPage: CellInfoCardPage;
};

export const test = base.extend<TestFixtures>({
  searchPage: async ({ page }, use) => {
    await use(new AssistantSearchPage(page));
  },
  formPage: async ({ page }, use) => {
    await use(new InitialInformationFormPage(page));
  },
  cellPage: async ({ page }, use) => {
    await use(new CellInfoCardPage(page));
  },
});

export { expect } from '@playwright/test';

export async function navigateAndSearchAsNew(page: any, searchPage: AssistantSearchPage) {
  await searchPage.goto();
  await searchPage.search(DOCUMENTS.NEW_CC);
}

export async function navigateAndSearchAsExisting(page: any, searchPage: AssistantSearchPage) {
  await searchPage.goto();
  await searchPage.search(DOCUMENTS.EXISTING_CC);
}

export function fillBasicForm(formPage: InitialInformationFormPage) {
  return formPage.fillBasicInfo({
    names: formData.names,
    lastNames: formData.lastNames,
    email: formData.email,
    phone: formData.phone,
    identificationType: formData.identificationType,
    identification: formData.identification,
  });
}
