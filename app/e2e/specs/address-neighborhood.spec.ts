import { test, expect } from '../fixtures/test.fixture';
import { DOCUMENTS } from '../data/constants';

test.describe('Address Standardizer & Neighborhood Autocomplete', () => {
  test.beforeEach(async ({ searchPage, formPage }) => {
    await searchPage.goto();
    await searchPage.search(DOCUMENTS.NEW_CC);
    await formPage.step1Indicator.waitFor({ state: 'visible' });
  });

  test('AddressStandardizer modal opens and saves address', async ({ formPage }) => {
    await formPage.fillAddressViaModal('Carrera', '15');
    const addressInput = formPage.page.getByLabel(/^Dirección/);
    await expect(addressInput).toHaveValue(/Carrera 15/);
  });

  test('AddressStandardizer modal cancel closes without saving', async ({ formPage }) => {
    await formPage.page.getByRole('button', { name: /estandarizar/i }).click();
    const dialog = formPage.page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: /cancelar/i }).click();
    await expect(dialog).not.toBeVisible();

    const prevValue = await formPage.page.getByLabel(/^Dirección/).inputValue();
    expect(prevValue).toBe('');
  });

  test('neighborhood autocomplete opens and shows search', async ({ formPage }) => {
    const trigger = formPage.page.getByRole('combobox', { name: /barrio/i });
    await trigger.click();

    const searchInput = formPage.page.getByPlaceholder('Buscar barrio...');
    await expect(searchInput).toBeVisible();
  });

  test('neighborhood autocomplete filters and selects option', async ({ formPage }) => {
    await formPage.selectNeighborhood('CENTRO MOSQUERA');
    const trigger = formPage.page.getByRole('combobox', { name: /barrio/i });
    await expect(trigger).toContainText('CENTRO MOSQUERA');
  });

  test('neighborhood autocomplete shows add button for non-existent name', async ({ formPage }) => {
    const trigger = formPage.page.getByRole('combobox', { name: /barrio/i });
    await trigger.click();
    await formPage.page.getByPlaceholder('Buscar barrio...').fill('BARRIO INEXISTENTE TEST');

    const addButton = formPage.page.getByRole('button', { name: /agregar/i });
    await expect(addButton).toBeVisible();
  });
});
