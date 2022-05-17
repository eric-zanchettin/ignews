import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import { getPrismicClient } from '../../services/prismic';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'

const postPreview = {
    slug: 'my-fake-post',
    title: 'My Fake Post',
    content: '<p>Post Content</p>',
    updatedAt: '01 de abril de 2021'
};

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

describe('Post Preview page', () => {
    it('renders correclty', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(
            <Post postPreview={postPreview} />
        );

        expect(screen.getByText('My Fake Post')).toBeInTheDocument();
        expect(screen.getByText('Post Content')).toBeInTheDocument();
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
    });

    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = mocked(useSession);
        const useRouterMocked = mocked(useRouter);
        const pushMocked = jest.fn();

        useSessionMocked.mockReturnValueOnce([
            { activeSubscription: 'fake-active-subscription' },
            false,
        ] as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMocked,
        } as any);

        render(
            <Post postPreview={postPreview} />
        );

        expect(pushMocked).toHaveBeenCalledWith('/posts/my-fake-post');
    });

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'My Fake Post', },
                    ],
                    content: [
                        { type: 'paragraph', text: '<p>Post Content</p>', },
                    ],
                },
                last_publication_date: '04-01-2021',
            }),
        } as any);

        const response = await getStaticProps({ params: { slug: 'my-fake-post' } } as any);

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    postPreview,
                },
            }),
        );
    });
});