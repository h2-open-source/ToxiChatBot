import chai from 'chai';
import { describe, it } from 'mocha';
import init from '../../src/modules/db/mongodb-init';

const { expect } = chai;

describe('mongodb-init', () => {
	it('should have init function', () => {
		expect(init).to.be.a('function');
	});
});
