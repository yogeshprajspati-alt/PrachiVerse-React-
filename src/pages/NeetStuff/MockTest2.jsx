import React from 'react';
import MockTest from './MockTest';
import { questions } from './MockTest2Data';

const MockTest2 = () => (
    <MockTest
        questions={questions}
        storageKey="neet_mock2"
        testTitle="NEET 2026 Mock Test — Paper 2"
    />
);

export default MockTest2;
