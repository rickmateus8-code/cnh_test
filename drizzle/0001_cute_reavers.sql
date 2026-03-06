CREATE TABLE `document_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`userId` int NOT NULL,
	`modificacoes` json,
	`descricao` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`profileId` int,
	`tipo` enum('historico','diploma') NOT NULL,
	`titulo` varchar(255),
	`dados` json,
	`hashValidacao` varchar(255),
	`qrCodeData` text,
	`status` enum('rascunho','finalizado','exportado') NOT NULL DEFAULT 'rascunho',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `local_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(64) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`displayName` varchar(128),
	`email` varchar(320),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`balance` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `local_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `local_users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nome` varchar(255) NOT NULL,
	`cpf` varchar(20),
	`rg` varchar(50),
	`nacionalidade` varchar(100),
	`naturalidade` varchar(100),
	`dataNascimento` varchar(20),
	`curso` varchar(255),
	`tituloConferido` varchar(255),
	`grauConferido` varchar(255),
	`habilitacao` varchar(255),
	`emec` varchar(20),
	`dataConclusao` varchar(20),
	`dataColacao` varchar(20),
	`dataEmissao` varchar(20),
	`endereco` text,
	`dadosExtras` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`)
);
