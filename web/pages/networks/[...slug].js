export default function NetworkPage() {
    return <div></div>;
}

export async function getStaticProps() {
    return {
        props: {
            bla: true
        }
    }
}

export async function getStaticPaths() {
    return {
        fallback: false,
        paths: [
            'my'
        ]
    }
}
