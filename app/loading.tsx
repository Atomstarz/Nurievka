import PageLayout from '../components/PageLayout';
import SkeletonLoader from '../components/SkeletonLoader';

export default function Loading() {
    return (
        <PageLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16 space-y-4">
        <div className="skeleton h-12 w-48 mx-auto"></div>
        <div className="skeleton-text w-96 mx-auto"></div>
        </div>
        <div className="space-y-8">
        <SkeletonLoader variant="post" count={5} />
        </div>
        </div>
        </PageLayout>
    );
}
