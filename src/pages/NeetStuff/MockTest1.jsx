import React from 'react';
import MockTest from './MockTest';
import { questions } from './MockTest1Data';

const MockTest1 = () => (
    <MockTest
        questions={questions}
        storageKey="neet_mock1"
        testTitle="NEET 2026 Mock Test — Paper 1"
    />
);

export default MockTest1;
