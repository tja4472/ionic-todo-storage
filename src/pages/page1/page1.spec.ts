import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils }               from '../../test';
import { Page1 }          from './page1';

let fixture: ComponentFixture<Page1> = null;
let instance: any = null;

describe('Pages: HelloIonic', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([Page1]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  it('should create the Page1 page', async(() => {
    expect(instance).toBeTruthy();
  }));
});