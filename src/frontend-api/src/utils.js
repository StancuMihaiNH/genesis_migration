import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ulid } from "ulid";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const SALT_ROUNDS = 10;
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "100y" });
};

export const verifyToken = (token) => {
  console.log("verifying token", token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded) {
    return decoded.id;
  }
  return null;
};

export const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

export const validatePassword = (password) => {
  return password.length >= 5;
};

export const presignedUrl = async (
  context,
  { filename, contentType, prefix },
) => {
  const { s3, user } = context;
  const userPrefix = user ? user.id : "public";
  const uploadPrefix = prefix || userPrefix;
  const key = `${uploadPrefix}/${ulid()}_${filename}`;
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return { key, url };
};

export const isAdministrator = (user) => {
  if (!user) {
    return false;
  }
  return user.role === "admin";
};

export const getSignedUrlForDownload = async (context, key) => {
  const { s3 } = context;
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(s3, command, { expiresIn: 24 * 60 * 60 });
};

export const getFileContent = async (context, key) => {
  const { s3 } = context;
  const data = await s3.send(
    new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    }),
  );
  let body = "";
  for await (const chunk of data.Body) {
    body += chunk;
  }
  return body;
};

export const uniqueIds = (ids) => {
  let _ids = [];
  let _idMap = {};
  ids.forEach((id) => {
    if (!_idMap[id]) {
      _idMap[id] = true;
      _ids.push(id);
    }
  });
  return _ids;
};
