import { useRouter } from 'next/router';
import { ActiveLink } from '../ActiveLink';

import { SignInButton } from '../SignInButton';

import styles from './styles.module.scss';

export function Header() {
    const { asPath } = useRouter();

    return (
        <>
            <header className={styles.headerContainer}>
                <div className={styles.headerContent}>
                    <ActiveLink activeClassName={styles.active} href="/">
                        <img src="/images/logo.svg" alt="ig.news" />
                    </ActiveLink>
                    <nav>
                        <ActiveLink activeClassName={styles.active} href="/">
                            <a>Home</a>
                        </ActiveLink>
                        <ActiveLink activeClassName={styles.active} href="/posts">
                            <a>Posts</a>
                        </ActiveLink>
                    </nav>
                    
                    <SignInButton />
                </div>
            </header>
        </>
    );
};