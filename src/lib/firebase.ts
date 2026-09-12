import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getDocFromServer,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AppLockConfig } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId (MANDATORY in AI Studio)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'system_config', 'appLock'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using cache if available.');
    }
    return false;
  }
}

export const DEFAULT_LOCK_CONFIG: AppLockConfig = {
  isLocked: true,
  accessPin: '7777', // 소속 FA 기본 사용자 접속 PIN
  adminPin: '0420', // 사업단장 기본 관리자 전용 PIN (대전지역번호 042 기반)
  updatedAt: new Date().toISOString(),
  updatedBy: '사업단장',
  branchName: '한화피플라이프 대전글로리사업단',
  lockNotice: '대전글로리사업단 소속 FA 전용 보안 인증 시스템입니다.',
};

/**
 * 실시간 중앙 클라우드 보안 잠금 설정 구독 (onSnapshot)
 * - 사업단장 PC에서 비밀번호를 바꾸거나 잠금을 해제/설정하면
 * - 모든 소속 FA의 스마트폰, 태블릿, PC 브라우저에 0.1초 내 즉시 실시간 동기화됨
 */
export function subscribeToAppLockConfig(
  callback: (config: AppLockConfig) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const docRef = doc(db, 'system_config', 'appLock');

  return onSnapshot(
    docRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.data();
        const data: AppLockConfig = {
          isLocked: raw.isLocked ?? true,
          accessPin: raw.accessPin || '7777',
          adminPin: raw.adminPin || '0420',
          updatedAt: raw.updatedAt || new Date().toISOString(),
          updatedBy: raw.updatedBy || '사업단장',
          branchName: raw.branchName || '한화피플라이프 대전글로리사업단',
          lockNotice: raw.lockNotice || '대전글로리사업단 소속 FA 전용 보안 인증 시스템입니다.',
        };
        callback(data);
      } else {
        // 최초 실행 시 기본 설정으로 문서 초기화
        try {
          await setDoc(docRef, DEFAULT_LOCK_CONFIG);
          callback(DEFAULT_LOCK_CONFIG);
        } catch (err) {
          console.error('Failed to initialize default lock config:', err);
          callback(DEFAULT_LOCK_CONFIG);
        }
      }
    },
    (error) => {
      console.error('AppLock onSnapshot listener error:', error);
      if (onError) {
        onError(error);
      }
    }
  );
}

/**
 * 사업단장 전용: 중앙 클라우드 비밀번호 및 보안 잠금 상태 업데이트
 * - 업데이트 성공 시 Firestore에 즉시 반영되며, 모든 FA 단말기에 실시간 broadcast 전파됨
 */
export async function updateCentralAppLock(
  newConfig: Partial<AppLockConfig>
): Promise<void> {
  const docPath = 'system_config/appLock';
  try {
    const docRef = doc(db, 'system_config', 'appLock');
    const updatePayload = {
      ...newConfig,
      updatedAt: new Date().toISOString(),
      updatedBy: newConfig.updatedBy || '사업단장',
      branchName: '한화피플라이프 대전글로리사업단',
    };
    await setDoc(docRef, updatePayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}
