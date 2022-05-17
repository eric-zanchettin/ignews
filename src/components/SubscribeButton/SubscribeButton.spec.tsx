import { render, screen, fireEvent } from '@testing-library/react';
import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import { SubscribeButton } from '.';

jest.mock('next-auth/client');
jest.mock('next/router');

describe("SubscribeButton component", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    it('renders correctly when user is not authenticated', () => {        
        render(
            <SubscribeButton />
        );

        expect(screen.getByText('Subscribe now')).toBeInTheDocument();
    });

    it('redirects user to sign in when not authenticated', () => {  
        const useSessionMocked = mocked(useSession);      
        const signInMocked = mocked(signIn);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(
            <SubscribeButton />
        );

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled();
    });

    it('redirects to posts when user already has a subscription', () => {
        const useRouterMocked = mocked(useRouter);
        const useSessionMocked = mocked(useSession);
        const pushMock = jest.fn();

        useRouterMocked.mockReturnValue({
            push: pushMock,
        } as any);

        useSessionMocked.mockReturnValueOnce([
            { user: { name: 'John Doe', email: 'john.doe@outlook.com' }, expires: 'fake-expires', activeSubscription: 'fake-active-subscription' },
            false
        ]);
        
        render(
            <SubscribeButton />
        );

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(pushMock).toHaveBeenCalledWith('/posts');
    });
});