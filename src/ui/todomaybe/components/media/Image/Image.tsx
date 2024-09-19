import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



type Image = PropsWithClassName & {
    src: string | null | undefined;
    lazy?: boolean;
    alt?: string;
    style?: React.CSSProperties;
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const styles = {
    image: 'h-auto w-full max-w-full object-cover',
};

export const Image: FC<Image> = ({
    className,
    style,
    src,
    alt,
    lazy = false,
    onLoad,
    onError,
}) => {
    const loading = lazy ? 'lazy' : 'eager';

    return (
        <img
            className={twClassNames(styles.image, className)}
            style={style}
            src={src ?? ''}
            alt={alt}
            loading={loading}
            decoding='async'
            draggable='false'
            contentEditable='false'
            onLoad={onLoad}
            onError={onError}
        />
    );
};





// import { EncodedFile, PropsWithClassName } from '@types';
// import { twClassNames } from '@utils';
// import { FC, ReactNode, useEffect, useRef, useState } from 'react';



// // type OptionalValues = {
// //     src: string | null;
// //     file?: never;
// // } | {
// //     src?: never;
// //     file: EncodedFile | null;
// // } | {
// //     src: string | null;
// //     file: EncodedFile | null;
// // }

// type Image = PropsWithClassName & {
//     src?: string | null;
//     file?: EncodedFile | null;
//     alt?: string;
//     placeholder?: ReactNode;
//     fallback?: ReactNode;
//     style?: React.CSSProperties;
// }

// const states = {
//     initial: {
//         error: false,
//         loading: true,
//     },
//     success: {
//         error: false,
//         loading: false,
//     },
//     failure: {
//         error: true,
//         loading: false,
//     },
// };

// const styles = {
//     image: {
//         base: 'min-w-[16px] min-h-[16px] h-auto w-full max-w-full object-cover opacity-0',
//         active: 'opacity-100',
//         error: 'opacity-0',
//     },
// };

// export const Image: FC<Image> = ({
//     className = '',
//     src,
//     file,
//     alt = '',
//     style,
//     placeholder,
//     fallback,
// }) => {
//     const imageRef = useRef<HTMLImageElement | null>(null);
//     const [imageState, setImageState] = useState(states.initial);

//     useEffect(() => {
//         if (!imageRef.current) return;
//         if (!src && !file) return;

//         const source = file ? file.base64 : (src || '');
//         const image = imageRef.current;

//         image.src = source;

//         const handleLoad = () => setImageState(states.success);
//         const handleError = () => setImageState(states.failure);

//         image.addEventListener('load', handleLoad);
//         image.addEventListener('error', handleError);

//         return () => {
//             image.removeEventListener('load', handleLoad);
//             image.removeEventListener('error', handleError);
//         };
//     }, [src, file]);

//     const showImage = (
//         (!imageState.loading && !imageState.error) ||
//         (!placeholder && imageState.loading) ||
//         (!fallback && imageState.error)
//     );
//     const showPlaceholder = !showImage && imageState.loading && !!placeholder;
//     const showFallback = !showImage && !imageState.loading && imageState.error && !fallback;

//     return (
//         <>
//             <img
//                 className={twClassNames(
//                     styles.image.base,
//                     {
//                         [styles.image.active]: showImage,
//                         [styles.image.error]: imageState.error,
//                     },
//                     className,
//                 )}
//                 style={style}
//                 alt={alt}
//                 draggable={false}
//                 contentEditable={false}
//                 ref={imageRef}
//             />

//             <If condition={showPlaceholder}>
//                 {placeholder}
//             </If>

//             <If condition={showFallback}>
//                 {fallback}
//             </If>
//         </>
//     );
// };