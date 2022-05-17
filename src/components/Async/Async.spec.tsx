import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Async } from '.';

test('it renders correctly', async () => {
    render(<Async />)

    expect(screen.getByText('Hello World!')).toBeInTheDocument();

    await waitForElementToBeRemoved(screen.queryByText('Button'), { timeout: 10000, interval: 3000 });

    // await waitFor(() => {
    //     return expect(screen.queryByText('Button')).not.toBeInTheDocument();
    // }, {
    //     timeout: 10000,
    //     interval: 3000,
    // });
});