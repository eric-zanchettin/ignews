import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { getPrismicClient } from '../../services/prismic';
import Posts, { getStaticProps } from '../../pages/posts'

const posts = [
    { slug: 'my-fake-post', title: 'My Fake Post', excerpt: 'Post Excerpt', updatedAt: '01 de abril de 2021' },
];

jest.mock('../../services/prismic');

describe('Posts page', () => {
    it('renders correclty', () => {
        render(
            <Posts
                posts={posts}
            />
        );

        expect(screen.getByText('My Fake Post')).toBeInTheDocument();
    });

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-fake-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'My Fake Post', },
                            ],
                            content: [
                                { type: 'paragraph', text: 'Post Excerpt', },
                            ],
                        },
                        last_publication_date: '04-01-2021',
                    }
                ],
            }),
        } as any);

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts
                },
            }),
        );
    });
});