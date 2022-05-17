import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { getPrismicClient } from '../../services/prismic';
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getSession } from 'next-auth/client';

const post = {
    slug: 'my-fake-post',
    title: 'My Fake Post',
    content: '<p>Post Content</p>',
    updatedAt: '01 de abril de 2021'
};

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

describe('Post page', () => {
    it('renders correclty', () => {
        render(
            <Post post={post} />
        );

        expect(screen.getByText('My Fake Post')).toBeInTheDocument();
        expect(screen.getByText('Post Content')).toBeInTheDocument();
    });

    it('redirects user if no subsription is found', async () => {
        const getSessionMocked = mocked(getSession);

        getSessionMocked.mockResolvedValueOnce(null);

        const response = await getServerSideProps({ params: { slug: 'my-fake-post' } } as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                }),
            }),
        );
    });

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession);
        const getPrismicClientMocked = mocked(getPrismicClient);

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any);

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

        const response = await getServerSideProps({ params: { slug: 'my-fake-post' } } as any);

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post,
                },
            }),
        );
    });
});